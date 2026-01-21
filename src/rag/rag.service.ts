import { Injectable } from '@nestjs/common';
import { getVectorStore } from './utils/vector-store';
import { ragConfig } from '../config/rag.config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class RagService {
  private readonly model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: ragConfig.llm.temperature,
    });
  }

  /**
   * Query the RAG system with a question
   * @param query The user's question
   * @param k Number of documents to retrieve (default from config)
   */
  async query(query: string, k: number = ragConfig.retriever.defaultK) {
    const vectorStore = await getVectorStore();

    // Detect comprehensive queries (asking for lists, all items, etc.)
    const isComprehensiveQuery = this.isComprehensiveQuery(query);
    
    // Adjust retrieval parameters for comprehensive queries
    let effectiveK = k;
    let effectiveFetchK = ragConfig.retriever.fetchK;
    let searchType = ragConfig.retriever.searchType;
    
    if (isComprehensiveQuery) {
      // For comprehensive queries, retrieve more chunks and use similarity for completeness
      effectiveK = Math.max(k * 3, 50); // At least 3x more, minimum 50 chunks
      effectiveFetchK = Math.max(ragConfig.retriever.fetchK * 2, 100); // Larger candidate pool
      searchType = 'similarity'; // Use similarity for completeness over diversity
    }

    // Create retriever with configurable parameters
    const retriever = vectorStore.asRetriever({
      searchType,
      k: effectiveK,            // final docs returned
      searchKwargs: {
        fetchK: effectiveFetchK, // candidate pool
        lambda: ragConfig.retriever.lambda, // MMR diversity (only used if MMR)
      },
    });

    // Retrieve relevant documents
    const docs = await retriever.invoke(query);

    // Build context with token limit awareness (increased for comprehensive queries)
    const maxContextChars = isComprehensiveQuery ? 50000 : 10000; // ~12,500 tokens for comprehensive
    const context = this.buildContext(docs, maxContextChars);

    // Get answer from model with appropriate prompt
    const systemPrompt = isComprehensiveQuery
      ? `You are a helpful assistant that extracts and synthesizes information from the provided context. 
When asked for lists or comprehensive information, carefully search through ALL the context to find and compile the requested items.
Extract specific details, numbers, titles, and key points from the documents. Format your response clearly and completely.
If you find partial information, include what you can find. Only say "I don't know" if the context truly contains no relevant information.`
      : "You are a helpful assistant that answers questions using the provided context. If the answer is not in the context, say you don't know.";

    const response = await this.model.invoke([
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Context (${docs.length} documents retrieved):\n\n${context}\n\nQuestion: ${query}`,
      },
    ]);

    return {
      answer:
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content),
      sources: docs.map((doc: any) => ({
        content: doc.pageContent.substring(0, 200) + '...', // Preview
        metadata: doc.metadata,
      })),
    };
  }

  /**
   * Detect if query asks for comprehensive lists or all items
   */
  private isComprehensiveQuery(query: string): boolean {
    const comprehensiveKeywords = [
      'all', 'each', 'every', 'list', 'complete', 'entire',
      'comprehensive', 'full', 'whole', 'entirety'
    ];
    const lowerQuery = query.toLowerCase();
    return comprehensiveKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Build context from documents while managing token/character limits
   * Progressively adds documents until reaching the limit
   * For comprehensive queries, includes more documents to provide complete context
   */
  private buildContext(docs: any[], maxContextChars: number = 10000): string {
    if (docs.length === 0) return '';
    
    let context = '';
    let docCount = 0;

    // Process documents in the order they were retrieved (already sorted by relevance)
    for (const doc of docs) {
      const docText = doc.pageContent;
      const separator = context ? '\n\n--- Document ' + (docCount + 1) + ' ---\n\n' : '';
      const potentialContext = context + separator + docText;

      if (potentialContext.length <= maxContextChars) {
        context = potentialContext;
        docCount++;
      } else {
        // Try to fit partial content if we have space
        const remainingSpace = maxContextChars - context.length - separator.length - 100;
        if (remainingSpace > 500 && docCount > 0) {
          context += separator + docText.substring(0, remainingSpace) + '\n...[truncated]';
          docCount++;
        }
        break;
      }
    }

    return context || docs[0]?.pageContent || '';
  }
}
