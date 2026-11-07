import { getPrisma, generateOrderCode, validateHash } from "../utils";
import zod, { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

// Zod validation schemas
const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters");

const emailSchema = z.string().email("Invalid email address");

const telegramHandleSchema = z.string()
  .optional()
  .nullable()
  .transform(v => v ? v.replace(/@/, "") : null);

const orderTypeSchema = z.enum(["script_only", "with_deployment"]);

const deploymentPrefSchema = z.object({
  subdomain: z.string().optional(),
  customDomain: z.string().optional(),
  environment: z.enum(["development", "staging", "production"]).default("development"),
  region: z.string().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  notes: z.string().max(500).optional(),
});

const paymentMethodSchema = z.enum(["btc", "eth", "usdt-trc20", "usdt-erc20", "usdc"]);

// Main order creation schema
const createOrderSchema = zod.object({
  name: nameSchema,
  email: emailSchema,
  telegramHandle: telegramHandleSchema,
  projectId: z.number(),
  type: orderTypeSchema.default("script_only"),
  deploymentPrefs: deploymentPrefSchema.optional(),
  paymentMethod: paymentMethodSchema,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate request body
    const body = req.body;
    
    if (!body.name || !body.email) {
      return res.status(400).json({ 
        success: false, 
        error: "Name and email are required",
        fields: ["name", "email"]
      });
    }

    const validatedData = createOrderSchema.parse(body);

    const prisma = getPrisma();

    // Generate order code and create order with pending status
    const orderCode = generateOrderCode();
    
    const order = await prisma.order.create({
      data: {
        orderCode,
        alias: validatedData.name,
        email: validatedData.email,
        telegramHandle: validatedData.telegramHandle,
        projectId: validatedData.projectId,
        type: validatedData.type as "ScriptOnly" | "WithDeployment",
        status: "PendingPayment",
      },
      include: {
        project: true,
      },
    });

    // Create payment record with pending verification
    const [wallet] = await prisma.wallet.findMany({
      where: { active: true },
      orderBy: { id: "asc" }
    });

    if (!wallet) {
      return res.status(400).json({ 
        success: false, 
        error: "No payment wallet configured" 
      });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: 1.0, // Will be updated with crypto rate
        coinNetwork: validatedData.paymentMethod,
        walletAddress: wallet.address,
        qrCode: "", // Generated later
        status: "PendingVerification",
        note: `Order ${orderCode}`,
      },
    });

    res.status(201).json({ 
      success: true, 
      data: { order, payment } 
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

    console.error("Order creation error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create order" 
    });
  }
}
