export class TelegramService {
  private botToken: string;

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.warn('Telegram bot token not configured. Admin notifications will not work.');
      this.botToken = '';
    } else {
      this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    }
  }

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    if (!this.botToken) return false;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: escapeMarkdown(text),
            parse_mode: 'Markdown',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Telegram API error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Telegram send error:', error);
      return false;
    }
  }

  async sendNewOrderAlert(orderCode: string, alias: string, projectTitle: string, coinNetwork: string, expectedAmount: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*🆕 New Order Alert*

Order Code: \`${orderCode}\`
Customer: *${alias}*
Project: ${projectTitle}
Payment: ${expectedAmount} ${coinNetwork}

<https://ciphercode.app/admin/orders>
    `.trim();

    const success = await this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
    
    return success;
  }

  async sendPaymentSubmitted(orderCode: string, alias: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*💳 Payment Submitted*

Order: \`${orderCode}\`
Customer: *${alias}*

Please verify transaction hash.
    `.trim();

    return this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
  }

  async sendPaymentApproved(orderCode: string, projectTitle: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*✅ Payment Approved*

Order: \`${orderCode}\`
Project: ${projectTitle}

Download access granted.
    `.trim();

    return this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
  }

  async sendPaymentRejected(orderCode: string, reason: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*❌ Payment Rejected*

Order: \`${orderCode}\`
Reason: ${reason}
    `.trim();

    return this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
  }

  async sendQuoteExpired(orderCode: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*⏱️ Quote Expired*

Order: \`${orderCode}\`

Payment quote has expired. Customer needs to request a new quote.
    `.trim();

    return this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
  }

  async sendDeploymentStatus(orderCode: string, status: string, url?: string): Promise<boolean> {
    if (!this.botToken) return false;

    const text = `
*☁️ Deployment Status Update*

Order: \`${orderCode}\`
Status: ${status}

${url ? `Live URL: <${url}>` : ''}
    `.trim();

    return this.sendMessage(process.env.TELEGRAM_CHAT_ID || '', text);
  }
}

// Helper to escape Markdown special characters
function escapeMarkdown(text: string): string {
  const markdownChars = ['[', ']', '(', ')', '<', '>', '_', '*', '`', '|'];
  
  let escaped = text;
  
  for (const char of markdownChars) {
    escaped = escaped.replace(new RegExp(char, 'g'), `\`${char}\``);
  }

  return escaped;
}
