import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { getVectorStore } from './vector-store';
import { textSplitter } from './text-splitter';

// pdf-parse is a CommonJS module - it's a function, not a class
const pdfParse = require('pdf-parse');

@Injectable()
export class DocumentIngestionService {
  /**
   * Add a single PDF document to the vector store
   * @param file PDF file buffer
   * @param metadata Optional metadata for the document
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
    await vectorStore.addDocuments(docs);

    return { success: true, count: docs.length };
  }

  /**
   * Validate that the uploaded file is a PDF
   */
  private validatePdfFile(file: Express.Multer.File): void {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(`File ${file.originalname} is not a PDF`);
    }
  }

  /**
   * Extract text content from PDF buffer
   */
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text?.trim();

      if (!text || text.length === 0) {
        throw new BadRequestException('No text content found in PDF');
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
   * Split text into chunks using the text splitter
   */
  private async splitTextIntoChunks(text: string) {
    return textSplitter.createDocuments([text]);
  }

  /**
   * Add metadata to document chunks
   */
  private addMetadataToChunks(
    docs: any[],
    fileName: string,
    metadata?: Record<string, any>,
  ): void {
    docs.forEach((doc) => {
      doc.metadata = {
        ...doc.metadata,
        fileName,
        ...metadata,
      };
    });
  }
}