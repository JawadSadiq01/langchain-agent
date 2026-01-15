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

    // Create retriever with configurable parameters
    const retriever = vectorStore.asRetriever({
      searchType: ragConfig.retriever.searchType,
      k,            // final docs returned
      searchKwargs: {
        fetchK: ragConfig.retriever.fetchK, // candidate pool
        lambda: ragConfig.retriever.lambda, // MMR diversity
      },
    });

    // Retrieve relevant documents
    const docs = await retriever.invoke(query);

    // Build context with token limit awareness
    const context = this.buildContext(docs);

    // Get answer from model
    const response = await this.model.invoke([
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions strictly using the provided context. If the answer is not in the context, say you don't know.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${query}`,
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
   * Build context from documents while managing token/character limits
   * Progressively adds documents until reaching the limit
   */
  private buildContext(docs: any[]): string {
    const maxContextChars = 10000; // Limit to ~2500 tokens approximately
    let context = '';
    let docCount = 0;

    for (const doc of docs) {
      const docText = doc.pageContent;
      const separator = context ? '\n\n---\n\n' : '';
      const potentialContext = context + separator + docText;

      if (potentialContext.length <= maxContextChars) {
        context = potentialContext;
        docCount++;
      } else {
        // Try to fit partial content if we have space
        const remainingSpace = maxContextChars - context.length - separator.length - 100;
        if (remainingSpace > 500 && docCount > 0) {
          context += separator + docText.substring(0, remainingSpace) + '\n...[truncated]';
        }
        break;
      }
    }

    return context || docs[0]?.pageContent || '';
  }
}
