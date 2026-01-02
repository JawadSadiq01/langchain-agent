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
    
    const now = new Date();
    const timestamp = now.toISOString();
    const formattedDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });

    return JSON.stringify({
      success: true,
      email: to,
      timestamp,
      formattedDate,
      formattedTime,
      message: `Welcome email successfully sent to ${to}`
    });
  }
}
