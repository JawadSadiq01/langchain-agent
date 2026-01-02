import { Module } from '@nestjs/common';
import { EmailAgentModule } from './email-agent/email-agent.module';
import { WebModule } from './web/web.module';

@Module({
  imports: [EmailAgentModule, WebModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
