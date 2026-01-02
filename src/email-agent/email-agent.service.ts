import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailAgent } from './agents/email.agent';

@Injectable()
export class EmailAgentService {
  constructor(private readonly emailAgent: EmailAgent) {}

  async sendWelcomeEmail(dto: SendEmailDto) {
    return await this.emailAgent.sendEmail(dto);
  }
}
