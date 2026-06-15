// ───────────────────────────────────────────────
//  Request Repository — Advanced search for Posts
// ───────────────────────────────────────────────

import type { Prisma } from "@prisma/client";
import prisma from "../../../config/database";

// ─── Types ─────────────────────────────────────

export interface SearchFilters {
  q?: string;
  category?: string;
  size?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  userId?: string;
}

export interface PaginatedPosts {
  posts: Array<Record<string, unknown>>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Helpers ───────────────────────────────────

/**
 * Build a bounding box for geographic search.
 * Returns [minLat, maxLat, minLng, maxLng] based on a center point and radius in km.
 * Uses the approximation: 1° ≈ 111 km.
 */
function buildBoundingBox(
  latitude: number,
  longitude: number,
  radiusKm: number,
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const kmPerDegree = 111.0;
  const latDelta = radiusKm / kmPerDegree;
  const lngDelta = radiusKm / (kmPerDegree * Math.cos((latitude * Math.PI) / 180));

  return {
    minLat: latitude - latDelta,
    maxLat: latitude + latDelta,
    minLng: longitude - lngDelta,
    maxLng: longitude + lngDelta,
  };
}

// ─── Repository ────────────────────────────────

export const requestRepository = {
  /**
   * Search posts with advanced filters and pagination.
   * Supports text search, category/size/location filters,
   * geographic bounding-box search, age/weight ranges, and userId.
   */
  async searchPosts(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedPosts> {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    // ── Text search (case-insensitive contains) ──
    if (filters.q) {
      where.name = { contains: filters.q, mode: "insensitive" };
    }

    // ── Exact category filter ──
    if (filters.category) {
      where.category = filters.category;
    }

    // ── Exact size filter ──
    if (filters.size) {
      where.size = filters.size;
    }

    // ── Location filter (case-insensitive contains) ──
    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }

    // ── Geographic bounding-box search ──
    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      filters.radius !== undefined
    ) {
      const box = buildBoundingBox(filters.latitude, filters.longitude, filters.radius);
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        { latitude: { gte: box.minLat, lte: box.maxLat } },
        { longitude: { gte: box.minLng, lte: box.maxLng } },
      ];
    }

    // ── Age range filter ──
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      where.age = {
        ...(filters.minAge !== undefined && { gte: filters.minAge }),
        ...(filters.maxAge !== undefined && { lte: filters.maxAge }),
      };
    }

    // ── Weight range filter ──
    if (filters.minWeight !== undefined || filters.maxWeight !== undefined) {
      where.weight = {
        ...(filters.minWeight !== undefined && { gte: filters.minWeight }),
        ...(filters.maxWeight !== undefined && { lte: filters.maxWeight }),
      };
    }

    // ── Filter by post owner ──
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
              contact: true,
              contactType: true,
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