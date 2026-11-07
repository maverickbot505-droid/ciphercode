import { getPrisma, generateOrderCode } from "../../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import zod, { z } from "zod";

// Zod schema for project creation
const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(5000).optional(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string().max(30)).default(["webapp", "template"]),
  price: z.number().min(0),
  demoUrl: z.string().url().optional(),
  screenshots: z.array(z.string()).default([]),
  bundle: z.string(), // S3 path to bundle archive
  license: z.enum(["MIT", "GPL-3.0", "Commercial", "Custom"]).default("MIT"),
  version: z.string().max(20).default("1.0.0"),
  status: z.enum(["draft", "published", "hidden", "sold_out"]).default("draft"),
  featured: z.boolean().default(false),
});

// Zod schema for project update (partial)
const updateProjectSchema = createProjectSchema.partial();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // In production, verify admin session/auth here
    const prisma = getPrisma();

    // Validate request body
    const validatedData = createProjectSchema.parse(req.body);

    // Generate unique slug if not provided
    let slug = validatedData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    let counter = 1;
    
    while (slug && (await prisma.project.findUnique({ where: { slug } }))) {
      // Add counter to avoid slug collision
      const parts = slug.split('-');
      if (parts.length > 0) {
        parts[parts.length - 1] = `${parseInt(parts[parts.length - 1]) || 0 + counter}`;
        slug = parts.join('-');
      } else {
        slug += `-${counter}`;
      }
      counter++;
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    res.status(201).json({ 
      success: true, 
      data: project,
      message: "Project created successfully"
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

    console.error("Project creation error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create project" 
    });
  }
}
