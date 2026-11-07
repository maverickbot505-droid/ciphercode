import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  plainText?: string;
}

interface TelegramOptions {
  chatId: string;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
}

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private prismaClient: PrismaClient;

  constructor(
    transporter: nodemailer.Transporter,
    prisma: PrismaClient
  ) {
    this.transporter = transporter;
    this.prismaClient = prisma;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.RESEND_FROM || 'CipherCode <noreply@ciphercode.app>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.plainText || options.html,
      });

      // Log delivery in database
      await this.prismaClient.notification.update({
        where: { id: options.id },
        data: { status: 'Sent', sentAt: new Date() },
      });
    } catch (error) {
      console.error('Email send failed:', error);
      throw error;
    }
  }

  async sendTelegram(chatId: string, text: string): Promise<void> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send Telegram message');
      }

      // Log delivery in database
      await this.prismaClient.notification.update({
        where: { id: options.id },
        data: { status: 'Sent', sentAt: new Date() },
      });
    } catch (error) {
      console.error('Telegram send failed:', error);
      throw error;
    }
  }

  async createOrderNotification(orderId: number, orderCode: string, project: any, amount: number, coinNetwork: string): Promise<void> {
    const prisma = new PrismaClient();
    const now = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const subject = `CipherCode Order ${orderCode} - ${project.title}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation</h2>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order Code:</strong> ${orderCode}</p>
          <p><strong>Project:</strong> ${project.title}</p>
          <p><strong>Amount Due:</strong> ${amount} ${coinNetwork}</p>
          <p><strong>Date:</strong> ${now}</p>
        </div>

        <h3>Next Steps</h3>
        <ol style="padding-left: 20px;">
          <li>Send the exact amount to your payment address</li>
          <li>Copy the transaction hash from your wallet</li>
          <li>Paste it in the "Track My Order" page using your order code</li>
        </ol>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>⏱️ Quote expires in: ${Math.floor(Math.random() * 60 + 25)} minutes</strong>
        </div>

        <a href="/tracking?orderCode=${orderCode}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          Track My Order →
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          Questions? Contact us at support@ciphercode.app<br/>
          This is an automated message - please do not reply directly to this email.
        </p>
      </div>
    `;

    const plainText = `
ORDER CONFIRMATION

Order Code: ${orderCode}
Project: ${project.title}
Amount Due: ${amount} ${coinNetwork}
Date: ${now}

NEXT STEPS:
1. Send the exact amount to your payment address
2. Copy the transaction hash from your wallet  
3. Paste it in "Track My Order" page using your order code

QUOTE EXPIRES IN: ${Math.floor(Math.random() * 60 + 25)} MINUTES

TRACK YOUR ORDER: /tracking?orderCode=${orderCode}

Questions? Contact support@ciphercode.app
    `;

    await prisma.notification.create({
      data: {
        type: 'NewOrder',
        orderId,
        message: html,
        status: 'Pending',
      },
    });
  }
}

// Helper to create transporter from environment
export function createEmailTransporter() {
  const host = process.env.NODEMAILER_HOST;
  const port = parseInt(process.env.NODEMAILER_PORT || '587');
  const user = process.env.NODEMAILER_USER;
  const password = process.env.NODEMAILER_PASSWORD;

  if (host && user && password) {
    return nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass: password },
    });
  } else {
    // Fallback for development/testing
    console.warn('Using in-memory transporter for development');
    return nodemailer.createTransport({
      send: async () => ({ id: 'test', messageId: 'test-message-id' }),
    }) as any;
  }
}
