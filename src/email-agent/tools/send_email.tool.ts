import { z } from 'zod';
import { tool } from 'langchain';
import { EmailService } from '../../helpers/email.helper';
import { message } from '../../messages';

const sendEmailSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .describe('The email address to send the email to'),
  subject: z.string().describe('The subject of the email'),
  body: z.string().describe('The body of the email'),
});

export const EmailTool = tool(
  async ({ email, subject, body }: z.infer<typeof sendEmailSchema>) => {
    const emailService = new EmailService();
    return await emailService.sendWelcomeEmail(email, subject, body);
  },
  {
    name: 'send_email',
    description: message.EMAIL_TOOL_DESCRIPTION,
    schema: sendEmailSchema,
  },
);
