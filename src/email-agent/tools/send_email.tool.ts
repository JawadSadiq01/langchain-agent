import * as z from "zod";
import { tool } from "langchain";
import { EmailService } from '../helpers/email.helper';
import { SendEmailDto } from "../dto/send-email.dto";

export const EmailTool = tool(
  async (dto: SendEmailDto) => await new EmailService().sendWelcomeEmail(dto.email),
  { name: "SendWelcomeEmail", description: "Send a welcome email to a specified email address" }
);