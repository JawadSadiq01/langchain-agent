import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailAgentService } from './email-agent.service';
import { CreateEmailAgentDto } from './dto/create-email-agent.dto';
import { UpdateEmailAgentDto } from './dto/update-email-agent.dto';

@Controller('email-agent')
export class EmailAgentController {
  constructor(private readonly emailAgentService: EmailAgentService) {}

  @Post()
  create(@Body() createEmailAgentDto: CreateEmailAgentDto) {
    return this.emailAgentService.create(createEmailAgentDto);
  }

  @Get()
  findAll() {
    return this.emailAgentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailAgentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailAgentDto: UpdateEmailAgentDto) {
    return this.emailAgentService.update(+id, updateEmailAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailAgentService.remove(+id);
  }
}
