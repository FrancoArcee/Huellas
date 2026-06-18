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

export interface PostFilters {
  category?: string;
  size?: string;
  location?: string;
  q?: string;
  // ── Geolocation filters ──
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  // ── Range filters ──
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  // ── User filter ──
  userId?: string;
}

// ─── Haversine distance (km) via raw SQL ──────
//  Returns post IDs that are within `radius` km
//  of the given (lat, lng) point.

async function findIdsWithinRadius(
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<string[]> {
  const rows: Array<{ id: string }> = await prisma.$queryRaw`
    SELECT id FROM "Post"
    WHERE (
      6371 * acos(
        LEAST(1.0,
          cos(radians(${latitude}::float8))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians(${longitude}::float8))
          + sin(radians(${latitude}::float8))
            * sin(radians(latitude))
        )
      )
    ) <= ${radiusKm}::float8
  `;
  return rows.map((r: { id: string }) => r.id);
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
   * List posts with optional filters, geolocation search, and pagination.
   *
   * When latitude + longitude + radius are provided, only posts within
   * that radius (in km) are returned. The Haversine formula is used via
   * a raw SQL query to find matching IDs, then Prisma fetches the full
   * records with all other filters applied.
   */
  async list(
    filters: PostFilters,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedPosts> {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    // ── Geolocation filter ───────────────────────
    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      filters.radius !== undefined
    ) {
      const ids = await findIdsWithinRadius(
        filters.latitude,
        filters.longitude,
        filters.radius,
      );
      where.id = { in: ids };
    }

    // ── Text / category filters ───────────────────
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

    // ── Range filters ────────────────────────────
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      where.age = {
        ...(filters.minAge !== undefined && { gte: filters.minAge }),
        ...(filters.maxAge !== undefined && { lte: filters.maxAge }),
      };
    }
    if (filters.minWeight !== undefined || filters.maxWeight !== undefined) {
      where.weight = {
        ...(filters.minWeight !== undefined && { gte: filters.minWeight }),
        ...(filters.maxWeight !== undefined && { lte: filters.maxWeight }),
      };
    }

    // ── User filter ──────────────────────────────
    if (filters.userId) {
      where.userId = filters.userId;
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