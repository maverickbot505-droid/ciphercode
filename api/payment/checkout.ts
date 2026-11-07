import { getPrisma, calculateCryptoAmount, formatCryptoAmount, getPaymentURIScheme } from "../utils";
import zod, { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

// Schema for quote request
const quoteSchema = z.object({
  orderId: z.number(),
  paymentMethod: z.enum(["btc", "eth", "usdt-trc20", "usdt-erc20", "usdc"]),
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
    const validatedData = quoteSchema.parse(body);

    const prisma = getPrisma();

    // Find the order and project
    const order = await prisma.order.findFirst({
      where: { 
        id: validatedData.orderId,
        status: "PendingPayment",
      },
      include: {
        project: true,
      },
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: "Order not found or already completed" 
      });
    }

    const price = order.project.price;
    const coinNetwork = validatedData.paymentMethod;

    // Calculate crypto amount
    const { cryptoAmount, rate } = await calculateCryptoAmount(price, coinNetwork);
    const formattedAmount = formatCryptoAmount(coinNetwork, cryptoAmount);

    // Generate QR code for payment URI
    const scheme = getPaymentURIScheme(coinNetwork);
    const paymentURI = `${scheme.prefix}:${order.payment?.walletAddress}?amount=${cryptoAmount}`;
    const qrDataUrl = await generateQRCode(paymentURI, coinNetwork);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderCode: order.orderCode,
        project: order.project,
        price: price.toFixed(2),
        cryptoAmount: formattedAmount,
        rate: rate.toFixed(6),
        coinNetwork,
        walletAddress: order.payment?.walletAddress || "",
        qrDataUrl,
      },
    });

  } catch (error) {
    console.error("Quote calculation error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to calculate payment quote" 
    });
  }
}

// QR Code generation function (server-side)
async function generateQRCode(data: string, coinNetwork: string): Promise<string> {
  try {
    const { QRCode } = await import("qrcode");
    
    // Generate base64 encoded QR code data URL
    const qrDataUrl = await QRCode.toDataURL(data);
    
    return qrDataUrl;
  } catch (error) {
    console.error("QR Code generation failed:", error);
    // Fallback: return a placeholder for development
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  }
}
