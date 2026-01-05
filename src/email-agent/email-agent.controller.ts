import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email-agent')
export class EmailAgentController {
  constructor(private readonly emailAgentService: EmailAgentService) {}

  @Post('send')
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const hasBody = !!sendEmailDto.body?.trim();
    const hasInstructions = !!sendEmailDto.instructions?.trim();

    if (!hasBody && !hasInstructions) {
      throw new BadRequestException(
        "Either 'body' or 'instructions' must be provided"
      );
    }
    return this.emailAgentService.sendEmail(sendEmailDto);
  }
}
