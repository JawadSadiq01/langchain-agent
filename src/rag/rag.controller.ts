import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RagService } from './rag.service';
import { DocumentIngestionService } from './utils/document-uploader.service';

@Controller('rag')
export class RagController {
  constructor(
    private readonly ragService: RagService,
    private readonly documentIngestionService: DocumentIngestionService,
  ) {}

  @Post('query')
  async query(@Body() body: { query: string; k?: number }) {
    return this.ragService.query(body.query, body.k);
  }

  @Post('ingest')
  @UseInterceptors(FileInterceptor('file'))
  async ingest(
    @UploadedFile() file: Express.Multer.File,
    @Body() body?: { metadata?: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const metadata = this.parseMetadata(body?.metadata);
    return this.documentIngestionService.addPdfDocument(file, metadata);
  }

  /**
   * Parse metadata from JSON string
   */
  private parseMetadata(metadataString?: string): Record<string, any> | undefined {
    if (!metadataString) {
      return undefined;
    }

    try {
      return JSON.parse(metadataString);
    } catch (error) {
      throw new BadRequestException('Invalid metadata JSON format');
    }
  }
}

