import { Module } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { EmailAgentController } from './email-agent.controller';
import { EmailService } from './helpers/email.helper';

@Module({
  controllers: [EmailAgentController],
  providers: [EmailAgentService, EmailService],
})
export class EmailAgentModule {}
