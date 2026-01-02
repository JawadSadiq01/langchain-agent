import { Injectable } from '@nestjs/common';
import { CreateEmailAgentDto } from './dto/create-email-agent.dto';
import { UpdateEmailAgentDto } from './dto/update-email-agent.dto';

@Injectable()
export class EmailAgentService {
  create(createEmailAgentDto: CreateEmailAgentDto) {
    return 'This action adds a new emailAgent';
  }

  findAll() {
    return `This action returns all emailAgent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emailAgent`;
  }

  update(id: number, updateEmailAgentDto: UpdateEmailAgentDto) {
    return `This action updates a #${id} emailAgent`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailAgent`;
  }
}
