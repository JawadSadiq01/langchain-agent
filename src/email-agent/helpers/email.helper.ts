import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(to: string): Promise<string> {
    const mailOptions = {
      from: 'Email Bot',
      to,
      subject: 'Welcome to Email Bot 🎉',
      text: "Welcome! We're glad to have you onboard.",
      html: `
        <h2>Welcome 🎉</h2>
        <p>We're glad to have you onboard.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);

    return `Welcome email sent to ${to}`;
  }
}
