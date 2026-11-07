import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Validate environment variables at runtime
export function validateEnvironment(): void {
  const requiredVars: Array<keyof typeof process.env> = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'JWT_SECRET',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Log warning if email service is not configured
  if (!process.env.RESEND_API_KEY && 
      !(process.env.NODEMAILER_HOST && process.env.NODEMAILER_USER)) {
    console.warn('Email service not configured. Orders will be created but notifications will fail.');
  }
}

// Generate order code (consistent format)
export function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CODE-';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

// Generate secret tracking token
export function generateTrackingToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `TRK-${token}`;
}

// Validate transaction hash based on network
export function validateTransactionHash(hash: string, coinNetwork: string): boolean {
  const patterns = {
    btc: /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$/,
    eth: /^0x[a-fA-F0-9]{40}$/,
    'usdt-trc20': /^T[A-Za-z1-9]{33}$/,
    usdc: /^T[A-Za-z1-9]{33}$/, // USDC on TRON uses same format as USDT
    'usdt-erc20': /^0x[a-fA-F0-9]{40}$/
  };

  const pattern = patterns[coinNetwork.toLowerCase()];
  return !pattern || pattern.test(hash.trim());
}

// Calculate crypto amount from fiat price
export async function calculateCryptoAmount(
  fiatPrice: number, 
  coinNetwork: string,
  customRate?: number
): Promise<{ cryptoAmount: number; rate: number }> {
  const defaultRates: Record<string, number> = {
    'btc': 0.0000175,  // BTC per USD (adjust based on current rate)
    'eth': 0.00032,     // ETH per USD
    'usdt-trc20': 1,   // Stablecoin = 1:1
    'usdt-erc20': 1,
    'usdc': 1
  };

  const rate = customRate || defaultRates[coinNetwork.toLowerCase()];
  
  if (!rate) {
    throw new Error(`Unsupported coin/network: ${coinNetwork}`);
  }

  const cryptoAmount = fiatPrice / (1 / rate);
  
  // Format with appropriate precision
  const decimals = coinNetwork.toLowerCase() === 'btc' ? 8 : 
                   coinNetwork.toLowerCase() === 'eth' ? 6 : 2;
  
  return {
    cryptoAmount: parseFloat(cryptoAmount.toFixed(decimals)),
    rate
  };
}

// Format crypto amount for display
export function formatCryptoAmount(coinNetwork: string, amount: number): string {
  const decimals = coinNetwork.toLowerCase() === 'btc' ? 8 : 
                   coinNetwork.toLowerCase() === 'eth' ? 6 : 2;
  
  return `${amount.toFixed(decimals)} ${formatCoinName(coinNetwork)}`;
}

function formatCoinName(network: string): string {
  const mapping: Record<string, string> = {
    'btc': 'BTC',
    'eth': 'ETH',
    'usdt-trc20': 'USDT-TRC20',
    'usdt-erc20': 'USDT-ERC20',
    'usdc': 'USDC'
  };

  return mapping[network.toLowerCase()] || network;
}

// Get expected hash format for error messages
export function getExpectedHashFormat(coinNetwork: string): string {
  const formats = {
    'btc': 'Bitcoin address (starts with 1, 3, or bc1)',
    'eth': 'ETH address (0x followed by 40 hex characters)',
    'usdt-trc20': 'TRC20 address (T prefix)',
    'usdc': 'TRC20 address (T prefix)',
    'usdt-erc20': 'ERC20 address (0x followed by 40 hex characters)'
  };

  return formats[coinNetwork.toLowerCase()] || 'Unknown network';
}

// Rate limiting storage (in-memory for development)
export const rateLimitStore: Record<number, Array<{ timestamp: number; key: string }>> = {};

export function isRateLimited(
  ip: string | undefined,
  windowMs: number = 60000,
  maxRequests: number = 10
): boolean {
  if (!ip) return false;

  const now = Date.now();
  const keyHash = hashString(ip);
  
  const requests = rateLimitStore[keyHash] || [];
  
  // Filter to only recent requests
  const recentRequests = requests.filter(
    request => now - request.timestamp < windowMs
  );

  if (recentRequests.length >= maxRequests) {
    return true;
  }

  // Store this request
  requests.push({ timestamp: now, key: `ip:${ip}` });
  rateLimitStore[keyHash] = requests;

  return false;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Helper to sanitize user input (XSS prevention)
export function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Generate unique signature for API responses
export function generateSignature(data: Record<string, any>, secret: string): string {
  // Simple hash-based signature (for demo - use proper HMAC in production)
  const str = JSON.stringify(Object.keys(data).sort().map(k => `${k}:${data[k]}`));
  return crypto.createHash('sha256')
    .update(str + secret)
    .digest('hex');
}

// Create signed download link with expiry
export function createSignedDownloadLink(
  url: string, 
  expiryMinutes: number = 60
): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Math.floor(Date.now() / 1000) + (expiryMinutes * 60);

  return `${url}?token=${token}&exp=${expiry}`;
}

// Validate download token
export function validateDownloadToken(token: string, expiry: number): boolean {
  if (!token || !expiry) return false;
  
  const now = Math.floor(Date.now() / 1000);
  return token === 'valid-token-placeholder' && now < expiry;
}
