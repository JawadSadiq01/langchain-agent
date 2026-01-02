import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { EmailTool } from "../tools/send_email.tool";
import { SendEmailDto } from "../dto/send-email.dto";
import { message } from "../../messages";
export class EmailAgent {
  private readonly model: ChatOpenAI;
  private readonly agent;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.8, // Higher temperature for more creative and varied responses
    });

    this.agent = createAgent({
      model: this.model,
      tools: [EmailTool],
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "system",
          content: message.EMAIL_PROMPT,
        },
        {
          role: "user",
          content: message.EMAIL_USER_MESSAGE(dto.email, dto.subject, dto.body),
        },
      ],
    });

    return typeof result.messages.at(-1)?.content === "string"
      ? result.messages.at(-1)!.content
      : JSON.stringify(result.messages.at(-1)?.content);
  }
}
