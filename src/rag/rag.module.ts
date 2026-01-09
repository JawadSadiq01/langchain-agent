import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { DocumentIngestionService } from './utils/document-uploader.service';

@Module({
  controllers: [RagController],
  providers: [RagService, DocumentIngestionService],
  exports: [RagService, DocumentIngestionService],
})
export class RagModule {}

