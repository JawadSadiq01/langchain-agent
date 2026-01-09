import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ragConfig } from "../../config/rag.config";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: ragConfig.textSplitter.chunkSize,
  chunkOverlap: ragConfig.textSplitter.chunkOverlap,
});
