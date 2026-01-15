import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getVectorStore } from './vector-store';
import { textSplitter } from './text-splitter';
import pdfParse from 'pdf-parse';

@Injectable()
export class DocumentIngestionService {
  /**
   * Add a single PDF document to the vector store
   * Supports large files by batching document ingestion
   */
  async addPdfDocument(
    file: Express.Multer.File,
    metadata?: Record<string, any>,
  ) {
    this.validatePdfFile(file);

    const text = await this.extractTextFromPdf(file.buffer);
    const docs = await this.splitTextIntoChunks(text);
    this.addMetadataToChunks(docs, file.originalname, metadata);

    const vectorStore = await getVectorStore();
    
    // For large document sets, batch the insertion to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      await vectorStore.addDocuments(batch);
    }

    return {
      success: true,
      count: docs.length,
      fileName: file.originalname,
    };
  }

  /**
   * Validate uploaded file (PDF type only, no size restrictions)
   */
  private validatePdfFile(file: Express.Multer.File): void {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        `File ${file.originalname} is not a PDF`,
      );
    }
  }

  /**
   * Extract text from PDF buffer
   */
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text?.trim();

      if (!text) {
        throw new BadRequestException(
          'No readable text found in PDF',
        );
      }

      return text;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to extract text from PDF: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Split text into vector-friendly chunks
   */
  private async splitTextIntoChunks(text: string) {
    return textSplitter.createDocuments([text]);
  }

  /**
   * Attach metadata to all chunks
   */
  private addMetadataToChunks(
    docs: any[],
    fileName: string,
    metadata?: Record<string, any>,
  ): void {
    docs.forEach((doc, index) => {
      doc.metadata = {
        ...doc.metadata,
        fileName,
        chunkIndex: index,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      };
    });
  }
}
