import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { EmailTool } from "../tools/send_email.tool";
import { SendEmailDto } from "../dto/send-email.dto";

export class EmailAgent {
  private readonly model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.8, // Higher temperature for more creative and varied responses
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const agent = createAgent({
      model: this.model,
      tools: [EmailTool],
    });

    const result = await agent.invoke({
      messages: [
        {
          role: "system",
          content: `You are a helpful email assistant. The user provides the email address, subject, and body. Your job is to use the SendWelcomeEmail tool with these exact values. After the tool runs, it returns JSON with success status, recipient email, subject, timestamp, formattedDate, and formattedTime. If successful, confirm the email was sent with the details. If it fails, report the error clearly.`,
        },
        {
          role: "user",
          content: `Send an email to ${dto.email} with subject: "${dto.subject}" and body: "${dto.body}"`,
        },
      ],
    });


    return typeof result.messages.at(-1)?.content === "string"
      ? result.messages.at(-1)!.content
      : JSON.stringify(result.messages.at(-1)?.content);
  }
}
