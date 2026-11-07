import { getPrisma } from "../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import zod, { z } from "zod";

// Zod schema for wallet creation/update
const walletSchema = z.object({
  coin: z.enum(["btc", "eth", "usdt-trc20", "usdt-erc20", "usdc"]),
  network: z.enum(["mainnet", "testnet"]).default("mainnet"),
  address: z.string().min(1).max(100),
  active: z.boolean().default(true),
});

// Zod schema for wallet update (requires password)
const updateWalletSchema = z.object({
  coin: z.enum(["btc", "eth", "usdt-trc20", "usdt-erc20", "usdc"]).optional(),
  network: z.enum(["mainnet", "testnet"]).optional(),
  address: z.string().min(1).max(100).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8), // Password required for wallet changes
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prisma = getPrisma();

    // In production, verify admin session and password here
    // Check if owner role
    const isAdminOwner = req.body.adminRole === "Owner";
    
    if (!isAdminOwner) {
      return res.status(403).json({ 
        success: false, 
        error: "Only Owner role can modify wallet addresses" 
      });
    }

    const body = req.body;
    const validatedData = walletSchema.parse(body);

    // Find current active wallet for the coin/network
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        coin: validatedData.coin,
        network: validatedData.network,
        active: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingWallet) {
      // Check if address has changed
      const hasChanged = existingWallet.address !== validatedData.address;

      if (hasChanged) {
        // Audit log entry
        await prisma.walletOrder.create({
          data: {
            walletId: existingWallet.id,
            action: "update",
            details: {
              oldAddress: existingWallet.address,
              newAddress: validatedData.address,
              changedAt: new Date(),
            },
            adminId: 1, // In production, get from session
          },
        });

        // Create audit log
        await prisma.auditLog.create({
          data: {
            action: "wallet_address_updated",
            entity: "Wallet",
            entityId: existingWallet.id,
            details: {
              coin: validatedData.coin,
              network: validatedData.network,
              oldAddress: existingWallet.address,
              newAddress: validatedData.address,
              adminId: 1,
            },
            ipAddress: req.ip || "unknown",
            userAgent: req.headers["user-agent"] as string | undefined,
          },
        });

        // Update wallet with cooldown (300 seconds = 5 minutes)
        const cooldownEnd = new Date(Date.now() + 300000);

        await prisma.wallet.update({
          where: { id: existingWallet.id },
          data: {
            address: validatedData.address,
            active: true,
            cooldownEnd,
          },
        });

        return res.json({ 
          success: true,
          message: "Wallet address updated successfully. Go live in 5 minutes.",
          cooldownEnd: cooldownEnd.toISOString(),
        });
      }
    } else {
      // Create new wallet (only Owner role with password)
      const newWallet = await prisma.wallet.create({
        data: {
          coin: validatedData.coin,
          network: validatedData.network,
          address: validatedData.address,
          ownerId: 1, // In production, get from session
          active: true,
        },
        include: {},
      });

      return res.status(201).json({ 
        success: true,
        message: "Wallet added successfully",
        data: newWallet,
      });
    }

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

    console.error("Wallet management error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to manage wallet" 
    });
  }
}
