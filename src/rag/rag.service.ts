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
      k, // Number of documents to retrieve
    });

    // Retrieve relevant documents
    const docs = await retriever.invoke(query);

    // Build context from retrieved documents
    const context = docs.map((doc: any) => doc.pageContent).join('\n\n');

    // Create prompt with context
    const prompt = `You are a helpful assistant that answers questions based on the provided context.

Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context:
${context}

Question: ${query}

Answer:`;

    // Get answer from model
    const response = await this.model.invoke(prompt);

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
