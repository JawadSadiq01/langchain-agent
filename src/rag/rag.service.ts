import { Injectable } from '@nestjs/common';
import { getVectorStore } from './utils/vector-store';
import { ChatOpenAI } from '@langchain/openai';
import { ragConfig } from '../config/rag.config';

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
   * @param k Number of documents to retrieve (default: from config)
   */
  async query(query: string, k?: number) {
    const vectorStore = await getVectorStore();

    // Use provided k or default from config
    const documentsToRetrieve = k || ragConfig.retriever.defaultK;

    // Build retriever configuration from config
    const retrieverConfig: any = {
      searchType: ragConfig.retriever.searchType,
      k: documentsToRetrieve,
    };

    // Add MMR-specific parameters if using MMR search
    if (ragConfig.retriever.searchType === 'mmr') {
      retrieverConfig.searchKwargs = {
        fetchK: ragConfig.retriever.fetchK,
        lambda: ragConfig.retriever.lambda,
      };
    }

    // Create retriever with configurable options
    const retriever = vectorStore.asRetriever(retrieverConfig);

    // Retrieve relevant documents
    const docs = await retriever.invoke(query);

    // Build context from retrieved documents
    const context = docs.map((doc: any) => doc.pageContent).join('\n\n');


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
}
