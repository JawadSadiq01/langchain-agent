import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { embeddings } from "../../config/embeddings";
import { pgPool } from "../../config/database";

// Initialize vector store (async - call this function to get the store)
export async function getVectorStore() {
  return await PGVectorStore.initialize(embeddings, {
    pool: pgPool,
    tableName: "documents",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });
}
