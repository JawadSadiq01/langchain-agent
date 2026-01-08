import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { EmailTool } from "../tools/send_email.tool";
import { SendEmailDto } from "../dto/send-email.dto";
import { message } from "../../messages";
import * as z from "zod";
import { loggingMiddleware, formatResponseMiddleware } from "../../middlewares";
export class EmailAgent {
  private readonly model: ChatOpenAI;
  private readonly agent;

  constructor() {
    const contextSchema = z.object({ 
      senderName: z.string(), 
    });

    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3, // Higher temperature for more creative and varied responses
    });

    this.agent = createAgent({
      model: this.model,
      tools: [EmailTool],
      middleware: [loggingMiddleware, formatResponseMiddleware],
      contextSchema
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const { email, name, subject = '', body = '', instructions = '', senderName } = dto;

    const result = await this.agent.invoke(
      {messages: [
        {
          role: "system",
          content: message.EMAIL_PROMPT(instructions),
        },
        {
          role: "user",
          content: message.EMAIL_USER_MESSAGE(email, name, subject, body, senderName),
        },
      ]},
      {context: {senderName}}
    );

    return typeof result.messages.at(-1)?.content === "string"
      ? result.messages.at(-1)!.content
      : JSON.stringify(result.messages.at(-1)?.content);
  }
}