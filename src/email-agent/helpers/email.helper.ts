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

  async sendWelcomeEmail(to: string, subject: string, body: string): Promise<string> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'Email Bot',
        to,
        subject,
        text: body,
        html: body,
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
        subject,
        timestamp,
        formattedDate,
        formattedTime,
        message: `Email successfully sent to ${to}`
      });
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}. Please check EMAIL_USER and EMAIL_PASSWORD environment variables.`);
    }
  }
}
