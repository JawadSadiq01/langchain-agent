import { z } from 'zod';
import { tool } from 'langchain';
import { EmailService } from '../helpers/email.helper';

const sendEmailSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .describe('The email address to send the welcome email to'),
  subject: z.string().describe('The subject of the email'),
  body: z.string().describe('The body of the email'),
});

export const EmailTool = tool(
  async ({ email, subject, body }: z.infer<typeof sendEmailSchema>) => {
    const emailService = new EmailService();
    return await emailService.sendWelcomeEmail(email, subject, body);
  },
  {
    name: 'SendWelcomeEmail',
    description:
      'Send an email to a specified email address with the provided subject and body. Returns a JSON object with success status, recipient email, subject, timestamp, formatted date and time.',
    schema: sendEmailSchema,
  },
);
