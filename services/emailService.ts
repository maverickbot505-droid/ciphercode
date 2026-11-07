import nodemailer from 'nodemailer';
import crypto from 'crypto';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter with environment variables
    const host = process.env.NODEMAILER_HOST;
    const port = parseInt(process.env.NODEMAILER_PORT || '587');
    
    if (host && process.env.NODEMAILER_USER) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });
    } else {
      // Development mode - in-memory transporter
      console.warn('Using development email transporter');
      this.transporter = nodemailer.createTransport({
        send: async (mail) => ({
          messageId: crypto.randomUUID(),
        }),
      }) as any;
    }

    // Add default headers
    this.transporter.on('message', (info, callback) => {
      if (!info.headers['X-Message-ID']) {
        info.headers['X-Message-ID'] = crypto.randomUUID();
      }
      callback(null, info);
    });
  }

  async send(options: {
    to: string;
    subject: string;
    html: string;
    plainText?: string;
    replyTo?: string;
  }): Promise<{ messageId: string }> {
    const mailOptions = {
      from: process.env.RESEND_FROM || 'CipherCode <noreply@ciphercode.app>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.plainText || undefined,
      replyTo: options.replyTo || undefined,
    } as any;

    // Add tracking pixels if configured
    if (process.env.EMAIL_TRACKING_PIXEL) {
      mailOptions.html = `<img src="${process.env.EMAIL_TRACKING_PIXEL}" style="display:none;" alt=""/>${mailOptions.html}`;
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { messageId: info.messageId || crypto.randomUUID() };
    } catch (error) {
      console.error('Email send failed:', error);
      throw new Error('Failed to send email');
    }
  }

  // Generate unique secret token for order tracking
  generateOrderTrackingToken(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = '';
    
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TRK-${token}`;
  }

  // Sign order confirmation to prevent tampering
  signOrderConfirmation(orderCode: string, alias: string, amount: number): string {
    const data = `${orderCode}:${alias}:${amount}:${Date.now()}`;
    return crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret')
      .update(data)
      .digest('hex');
  }
}
