import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Export singleton instance to prevent multiple connections in development
export const getPrisma = (): typeof prisma => prisma;

// Helper to validate environment variables
export const validateEnv = () => {
  const requiredVars = [
    "DATABASE_URL",
    "AUTH_SECRET"
  ];

  const missingVars = requiredVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Helper to generate order code
export const generateOrderCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CODE-";
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

// Helper to calculate crypto amount from fiat price
export const calculateCryptoAmount = async (
  fiatPrice: number,
  coinNetwork: string
): Promise<{ cryptoAmount: number; rate: number }> => {
  // Use CoinGecko API for live rates (in production, use your preferred exchange)
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${getCoinId(coinNetwork)}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch crypto rates");
    }

    const data = await response.json();
    const rate = data[getCoinId(coinNetwork)]?.usd || 1;
    
    // Adjust for different coins
    let multiplier = 1;
    switch (coinNetwork.toLowerCase()) {
      case "btc":
        multiplier = 0.00001; // BTC per USD
        break;
      case "eth":
        multiplier = 0.0004; // ETH per USD
        break;
      case "usdt-trc20":
      case "usdt-erc20":
      case "usdc":
        multiplier = 1; // Stablecoin
        break;
    }

    const cryptoAmount = (fiatPrice / rate) * multiplier;
    
    return {
      cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
      rate
    };
  } catch (error) {
    console.error("Error fetching crypto rates:", error);
    // Fallback to simulated rates for development
    return getFallbackCryptoAmount(fiatPrice, coinNetwork);
  }
};

// Helper to get CoinGecko ID from network name
const getCoinId = (network: string): string => {
  const mapping: Record<string, string> = {
    "btc": "bitcoin",
    "eth": "ethereum",
    "usdt-trc20": "tether",
    "usdt-erc20": "tether",
    "usdc": "usd-coin"
  };
  return mapping[network.toLowerCase()] || network;
};

// Fallback rates for development
const getFallbackCryptoAmount = (
  fiatPrice: number, 
  coinNetwork: string
): { cryptoAmount: number; rate: number } => {
  const fallbackRates: Record<string, number> = {
    "btc": 0.0000175,
    "eth": 0.00032,
    "usdt-trc20": 1,
    "usdt-erc20": 1,
    "usdc": 1
  };
  
  const rate = fallbackRates[coinNetwork.toLowerCase()] || 1;
  return {
    cryptoAmount: parseFloat((fiatPrice / rate).toFixed(8)),
    rate
  };
};

// Helper to format crypto amount with precision based on network
export const formatCryptoAmount = (coinNetwork: string, amount: number): string => {
  switch (coinNetwork.toLowerCase()) {
    case "btc":
      return amount.toFixed(8);
    case "eth":
      return amount.toFixed(6);
    default:
      return amount.toFixed(amount < 1 ? 4 : 0);
  }
};

// Helper to generate QR code data URL for specific crypto networks
export const getPaymentURIScheme = (coinNetwork: string): { prefix: string; suffix?: string } => {
  switch (coinNetwork.toLowerCase()) {
    case "btc":
      return { prefix: "bitcoin", suffix: "?amount=" };
    case "eth":
      return { prefix: "ethereum" }; // Use EIP-681 full format
    case "usdt-trc20":
    case "usdc":
      return { prefix: "tron" };
    case "usdt-erc20":
      return { prefix: "ethereum" };
    default:
      return { prefix: "unknown", suffix: "?amount=" };
  }
};

// Validate transaction hash based on network
export const validateHash = (hash: string, coinNetwork: string): boolean => {
  const patterns: Record<string, RegExp> = {
    "btc": /^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$/, // Bitcoin addresses
    "eth": /^0x[a-fA-F0-9]{40}$/, // ETH address
    "usdt-trc20": /^T[A-Za-z1-9]{33}$/, // TRC20 (TRX)
    "usdc": /^T[A-Za-z1-9]{33}$/, // USDC on TRON
    "usdt-erc20": /^0x[a-fA-F0-9]{40}$/ // ERC20 (ETH)
  };

  const pattern = patterns[coinNetwork.toLowerCase()];
  return !pattern || pattern.test(hash.trim());
};
