import { Controller, Post, Body } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email-agent')
export class EmailAgentController {
  constructor(private readonly emailAgentService: EmailAgentService) {}

  @Post('welcome')
  sendWelcomeEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailAgentService.sendWelcomeEmail(sendEmailDto);
  }
}
