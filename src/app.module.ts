import { Module } from '@nestjs/common';
import { EmailAgentModule } from './email-agent/email-agent.module';

@Module({
  imports: [EmailAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
