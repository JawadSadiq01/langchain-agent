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

    const stream = await agent.stream({
      messages: [
        {
          role: "system",
          content: `You are a helpful email assistant. The user provides the email address, subject, and body. Your job is to use the SendWelcomeEmail tool with these exact values. After the tool runs, you must provide a handsome and engaging response to the user.`,
        },
        {
          role: "user",
          content: `Send an email to ${dto.email} with subject: "${dto.subject}" and body: "${dto.body}"`,
        },
      ],
    });

    let finalResponse = '';
    for await (const chunk of stream) {
      for (const state of Object.values(chunk)) {
        const messages = (state as any).messages;
        if (messages && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage?.content) {
            finalResponse = typeof lastMessage.content === 'string' 
              ? lastMessage.content 
              : JSON.stringify(lastMessage.content);
            console.log('Messages:', messages);
          }
        }
      }
    }

    return finalResponse || 'Email sent successfully';
  }
}
