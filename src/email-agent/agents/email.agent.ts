import { createAgent } from "langchain";
import { EmailTool } from "../tools/send_email.tool";
import { SendEmailDto } from "../dto/send-email.dto";

export class EmailAgent {
  constructor(private readonly emailTool: typeof EmailTool) {}

  async sendEmail(dto: SendEmailDto) {
    const agent = createAgent({
      model: "gpt-5",
      tools: [this.emailTool],
    });

    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: "Send a welcome email to the user",
        },
      ],
    });

    return result.output;
  }
}
