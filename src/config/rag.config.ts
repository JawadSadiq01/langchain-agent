/**
 * RAG Configuration
 * All retriever and text splitting settings can be configured via environment variables
 */

export const ragConfig = {
  // Retriever Configuration
  retriever: {
    // Search type: 'mmr' (Maximal Marginal Relevance) or 'similarity'
    searchType: (process.env.RAG_SEARCH_TYPE as 'mmr' | 'similarity') || 'mmr',
    
    // Number of documents to retrieve (default: 4)
    defaultK: parseInt(process.env.RAG_DEFAULT_K || '4', 10),
    
    // Candidate pool size for MMR search (default: 20)
    // MMR selects k documents from fetchK candidates for better diversity
    fetchK: parseInt(process.env.RAG_FETCH_K || '20', 10),
    
    // MMR diversity parameter (0-1, default: 0.5)
    // Higher values = more diverse results, lower = more similar
    lambda: parseFloat(process.env.RAG_MMR_LAMBDA || '0.5'),
  },

  // Text Splitter Configuration
  textSplitter: {
    // Maximum chunk size in characters (default: 700)
    chunkSize: parseInt(process.env.RAG_CHUNK_SIZE || '700', 10),
    
    // Overlap between chunks in characters (default: 120)
    // Overlap helps maintain context across chunk boundaries
    chunkOverlap: parseInt(process.env.RAG_CHUNK_OVERLAP || '120', 10),
  },

  // LLM Configuration for RAG
  llm: {
    // Temperature for RAG responses (default: 0.7)
    // Lower = more focused, Higher = more creative
    temperature: parseFloat(process.env.RAG_TEMPERATURE || '0.7'),
  },
};
