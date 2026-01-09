import { Module } from '@nestjs/common';
import { EmailAgentModule } from './email-agent/email-agent.module';
import { WebModule } from './web/web.module';
import { RagModule } from './rag/rag.module';

@Module({
  imports: [EmailAgentModule, WebModule, RagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
