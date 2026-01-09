import { Injectable } from '@nestjs/common';
import { getVectorStore } from './utils/vector-store';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class RagService {
  private readonly model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  /**
   * Query the RAG system with a question
   * @param query The user's question
   * @param k Number of documents to retrieve (default: 4)
   */
  async query(query: string, k: number = 4) {
    const vectorStore = await getVectorStore();

    // Create retriever
    const retriever = vectorStore.asRetriever({
      searchType: "mmr",
      k,            // final docs returned
      searchKwargs: {
        fetchK: 20, // candidate pool
      },
    });

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
