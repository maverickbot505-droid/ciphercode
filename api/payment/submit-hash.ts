import { getPrisma, validateHash } from "../utils";
import zod, { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

// Rate limiting storage (in production, use Redis)
const hashSubmissions: Record<number, Array<{ timestamp: Date; hash: string }>> = {};

const hashSchema = z.object({
  orderId: z.number(),
  transactionHash: z.string().min(10, "Invalid transaction hash format"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    const validatedData = hashSchema.parse(body);

    const prisma = getPrisma();
    const coinNetwork = validatedData.payment?.coinNetwork || "";

    // Rate limiting: max 1 submission per order per window
    const now = Date.now();
    if (hashSubmissions[validatedData.orderId]) {
      hashSubmissions[validatedData.orderId] = hashSubmissions[validatedData.orderId].filter(
        submission => now - submission.timestamp < 3600000 // 1 hour window
      );
      
      if (hashSubmissions[validatedData.orderId].length >= 2) {
        return res.status(429).json({ 
          success: false, 
          error: "Rate limit exceeded. Please wait before submitting again.",
          retryAfter: 3600
        });
      }
    }

    // Validate hash format for the selected network
    if (!validateHash(validatedData.transactionHash, coinNetwork)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid transaction hash format for this network",
        expectedFormat: getExpectedHashFormat(coinNetwork)
      });
    }

    // Check for duplicate submission
    const existingSubmission = hashSubmissions[validatedData.orderId].find(
      s => s.hash === validatedData.transactionHash
    );

    if (existingSubmission) {
      return res.status(400).json({ 
        success: false, 
        error: "This transaction hash has already been submitted" 
      });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: { id: validatedData.orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      return res.status(404).json({ 
        success: false, 
        error: "Payment not found" 
      });
    }

    // Add hash to queue for admin verification
    await prisma.$transaction(async (tx) => {
      // Create a quote history entry for audit
      const now = new Date();
      const expiryTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
      
      await tx.quoteHistory.create({
        data: {
          orderId: validatedData.orderId,
          amount: parseFloat(order.payment.amount.toFixed(8)),
          coinNetwork,
          rate: 1.0, // Will be updated later
          quoteAmount: parseFloat(order.payment.amount),
          expiryTime,
        },
      });

      // Add hash to submission queue
      if (!hashSubmissions[validatedData.orderId]) {
        hashSubmissions[validatedData.orderId] = [];
      }
      
      hashSubmissions[validatedData.orderId].push({
        timestamp: new Date(),
        hash: validatedData.transactionHash,
      });
    });

    res.json({ 
      success: true, 
      message: "Transaction hash submitted. Please wait for admin verification.",
      orderCode: order.orderCode,
    });

  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Validation failed",
        details: error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message
        }))
      });
    }

    console.error("Hash submission error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to submit transaction hash" 
    });
  }
}

// Helper to get expected hash format
function getExpectedHashFormat(coinNetwork: string): string {
  const formats: Record<string, string> = {
    "btc": "Bitcoin address (starts with 1, 3, or bc1)",
    "eth": "ETH address (0x followed by 40 hex characters)",
    "usdt-trc20": "TRC20 address (T prefix)",
    "usdc": "TRC20 address (T prefix)",
    "usdt-erc20": "ERC20 address (0x followed by 40 hex characters)"
  };
  return formats[coinNetwork.toLowerCase()] || "Unknown network format";
}
