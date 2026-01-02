import { z } from "zod";
import { tool } from "langchain";
import { EmailService } from '../helpers/email.helper';

const sendEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).describe("The email address to send the welcome email to"),
});

export const EmailTool = tool(
  async ({ email }: z.infer<typeof sendEmailSchema>) => {
    const emailService = new EmailService();
    return await emailService.sendWelcomeEmail(email);
  },
  {
    name: "SendWelcomeEmail",
    description: "Send a welcome email to a specified email address. Returns a JSON object with success status, recipient email, timestamp, formatted date and time.",
    schema: sendEmailSchema,
  }
);