import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailAgentDto } from './create-email-agent.dto';

export class UpdateEmailAgentDto extends PartialType(CreateEmailAgentDto) {}
