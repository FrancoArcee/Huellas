// ───────────────────────────────────────────────
//  Animal Repository — Prisma operations for Post
// ───────────────────────────────────────────────

import type { Prisma } from "@prisma/client";
import prisma from "../../../config/database";

// ─── Types ─────────────────────────────────────

export interface PaginatedPosts {
  posts: Array<Record<string, unknown>>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Repository ────────────────────────────────

export const animalRepository = {
  /**
   * Find a single post by its unique ID.
   * Includes the author user and a count of favorites.
   */
  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            contact: true,
            contactType: true,
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });
  },

  /**
   * Create a new post (animal publication).
   */
  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data });
  },

  /**
   * Update an existing post. Returns the updated record.
   */
  async update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a post by ID.
   */
  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  },

  /**
   * List posts with optional filters and pagination.
   */
  async list(
    filters: {
      category?: string;
      size?: string;
      location?: string;
      q?: string;
    },
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedPosts> {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.size) {
      where.size = filters.size;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }
    if (filters.q) {
      where.name = { contains: filters.q, mode: "insensitive" };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: { favorites: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};