import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { EmailTool } from "../tools/send_email.tool";
import { SendEmailDto } from "../dto/send-email.dto";

export class EmailAgent {
  private readonly model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0,
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
          role: "user",
          content: `Send a welcome email to ${dto.email}`,
        },
      ],
    });

    // Get the last message from the result, which contains the AI's response
    const lastMessage = result.messages.at(-1);
    if (!lastMessage) {
      throw new Error('No response from agent');
    }
    return typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : JSON.stringify(lastMessage.content);
  }
}
