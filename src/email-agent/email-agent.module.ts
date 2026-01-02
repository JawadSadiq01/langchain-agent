import { Module } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { EmailAgentController } from './email-agent.controller';
import { EmailService } from './helpers/email.helper';
import { EmailAgent } from './agents/email.agent';

@Module({
  controllers: [EmailAgentController],
  providers: [EmailAgentService, EmailService, EmailAgent],
})
export class EmailAgentModule {}
