import { getPrisma } from "../utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = getPrisma();

  // Support GET with query params for filtering and search
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { search, category, sort, status } = req.query;

  // Build filter conditions
  const where: any = { status: "Published" };
  
  if (search) {
    where.title = { contains: search as string, mode: "insensitive" };
    where.description = { 
      contains: search as string, 
      mode: "insensitive",
      ...(where.title ? "AND" : {})
    };
  }

  if (category) {
    where.category = category as string;
  }

  // Get all matching projects with pagination
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        tags: true,
        price: true,
        demoUrl: true,
        screenshots: true,
        status: true,
        createdAt: true,
        featured: true,
      },
    }),
    prisma.project.count({ where })
  ]);

  // Apply sorting
  const orderByMap: Record<string, any> = {
    new: "createdAt",
    price_asc: "price",
    price_desc: "price"
  };

  if (sort && orderByMap[sort as keyof typeof orderByMap]) {
    projects.sort((a, b) => {
      const key = a[sort]! > b[sort]! ? 1 : -1;
      return key || 0;
    });
  }

  res.json({
    success: true,
    data: projects,
    total,
  });
}
