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
          content: `You are a witty, enthusiastic email assistant. After SendWelcomeEmail runs, it returns JSON with recipient email, formattedDate, and formattedTime. Craft a fun, creative, unique confirmation message for each email sent. Always include the email, date, and time. Be playful, humorous, use emojis, puns, or fun facts, and make every response feel fresh and personalized.`,
        },
        {
          role: "user",
          content: `Send a welcome email to ${dto.email}`,
        },
      ],
    });


    return typeof result.messages.at(-1)?.content === "string"
      ? result.messages.at(-1)!.content
      : JSON.stringify(result.messages.at(-1)?.content);
  }
}
