import { getPrisma } from "../../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import zod, { z } from "zod";

// Zod schema for order status change
const updateOrderSchema = z.object({
  orderId: z.number(),
  status: z.enum([
    "pending_payment",
    "payment_submitted",
    "payment_approved",
    "payment_rejected",
    "download_ready",
    "building",
    "live",
    "failed",
    "cancelled",
    "refunded",
  ]),
  note: z.string().max(500).optional(),
});

// Zod schema for order verification
const verifyOrderSchema = z.object({
  orderId: z.number(),
  action: z.enum(["approve", "reject", "request_info"]),
  reason: z.string().max(1000).optional(), // For reject or request_info
  receivedAmount: z.number().min(0).optional(),
  confirmations: z.number().min(0).optional(),
  destinationAddress: z.string().optional(),
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

    // In production, verify admin session here
    if (!req.body.adminRole || req.body.adminRole !== "Owner") {
      return res.status(403).json({ 
        success: false, 
        error: "Only Owner role can modify orders" 
      });
    }

    const body = req.body;
    let validatedData;

    if (body.action) {
      // Verification action
      validatedData = verifyOrderSchema.parse(body);
    } else {
      // Status update or note
      validatedData = updateOrderSchema.parse(body);
    }

    const orderId = validatedData.orderId;
    let order;

    try {
      order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { payment: true, project: true },
      });
    } catch (error) {
      // Handle SQLite foreign key constraint
      console.error("Order not found:", error);
    }

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: "Order not found" 
      });
    }

    if (validatedData.action === "approve") {
      // Approve payment
      const newStatus: any = validatedData.receivedAmount 
        ? validatedData.receivedAmount >= parseFloat(order.payment.amount)
          ? "DownloadReady"
          : "Rejected"
        : "DownloadReady";

      await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any, notes: validatedData.note || order.notes },
      });

      // If deployment requested, move to deployment queue
      if (order.type === "WithDeployment") {
        await prisma.deployment.create({
          data: {
            orderId,
            status: "Queued",
            region: validatedData.region || "auto",
            envVars: validatedData.envVars || {},
            subdomain: validatedData.subdomain,
            customDomain: validatedData.customDomain,
            logs: ["Payment approved. Deployment queued."],
          },
        });
      }

      return res.json({ 
        success: true,
        message: `Order ${orderId} status updated to ${newStatus}`,
        data: { orderId, newStatus },
      });

    } else if (validatedData.action === "reject") {
      // Reject payment
      const rejectionReason = validatedData.reason || "Payment rejected by admin";

      await prisma.payment.update({
        where: { id: order.payment!.id },
        data: {
          status: "Rejected",
          note: rejectionReason,
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "PaymentRejected",
          notes: `${order.notes}\n${rejectionReason}`,
        },
      });

      // Create audit log for rejection
      await prisma.auditLog.create({
        data: {
          action: "payment_rejected",
          entity: "Order",
          entityId: orderId,
          details: {
            reason: rejectionReason,
            adminId: 1, // In production, get from session
          },
          ipAddress: req.ip || "unknown",
          userAgent: req.headers["user-agent"] as string | undefined,
        },
      });

      return res.json({ 
        success: true,
        message: `Payment rejected with reason: ${rejectionReason}`,
        data: { orderId, reason: rejectionReason },
      });

    } else if (validatedData.action === "request_info") {
      // Request more info from customer
      const requestId = Date.now();

      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "PaymentSubmitted",
          notes: `${order.notes}\nRequest ID: ${requestId}`
        },
      });

      return res.json({ 
        success: true,
        message: `More info requested from customer. Request ID: ${requestId}`,
        data: { orderId, requestId },
      });

    } else if (validatedData.status) {
      // Status update without action field
      const oldStatus = order.status;
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: validatedData.status, notes: validatedData.note || order.notes },
      });

      return res.json({ 
        success: true,
        message: `Order status changed from ${oldStatus} to ${validatedData.status}`,
        data: { orderId, oldStatus, newStatus: validatedData.status },
      });
    }

    return res.json({ 
      success: true,
      message: "No changes made",
      data: {},
    });

  } catch (error) {
    console.error("Order management error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to manage order" 
    });
  }
}
