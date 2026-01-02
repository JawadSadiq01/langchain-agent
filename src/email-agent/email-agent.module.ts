import { Module } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { EmailAgentController } from './email-agent.controller';

@Module({
  controllers: [EmailAgentController],
  providers: [EmailAgentService],
})
export class EmailAgentModule {}
