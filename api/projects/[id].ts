import { getPrisma } from "../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedUrlQuery } from "querystring";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParsedUrlQuery>
) {
  const prisma = getPrisma();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const projectId = parseInt(req.query.id as string);

  if (isNaN(projectId)) {
    return res.status(400).json({ 
      success: false, 
      error: "Invalid project ID" 
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
        bundle: true,
        license: true,
        version: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: "Project not found" 
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch project" 
    });
  }
}
