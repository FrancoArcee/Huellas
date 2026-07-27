// ───────────────────────────────────────────────
//  Animal Repository — Prisma operations for Post
// ───────────────────────────────────────────────

import type { Prisma } from "@prisma/client";
import prisma from "../../../config/database";
import type { AreaFilter } from "../../locations/service/location.service";

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
  gender?: string;
  location?: string;
  areaFilter?: AreaFilter;
  q?: string;
  status?: string;
  // ── Geolocation filters ──
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  // ── Range filters ──
  minAge?: number;
  maxAge?: number;
  neutered?: boolean;
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

function mapPostClinicalHistory(post: any) {
  if (!post) return post;
  const entries = post.clinicalHistory?.entries ?? [];
  return {
    ...post,
    clinicalHistory: entries.map((entry: any) => ({
      id: entry.id,
      postId: post.id,
      type: entry.eventType,
      name: entry.name || entry.title || "",
      date: entry.date,
      veterinary: entry.veterinary || "",
      veterinarian: entry.veterinarian || "",
      comprobante: entry.documentsUrl?.[0] || "",
      description: entry.description,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })),
  };
}

export const animalRepository = {
  /**
   * Find a single post by its unique ID.
   * Includes the author user and a count of favorites.
   */
  async findById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            profilePictureUrl: true,
            contact: true,
            contactType: true,
          },
        },
        clinicalHistory: {
          include: {
            entries: {
              orderBy: { date: "asc" },
            },
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });
    return mapPostClinicalHistory(post);
  },

  /**
   * Create a new post (animal publication).
   */
  async create(data: Prisma.PostCreateInput) {
    const post = await prisma.post.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            profilePictureUrl: true,
            contact: true,
            contactType: true,
          },
        },
        clinicalHistory: {
          include: {
            entries: {
              orderBy: { date: "asc" },
            },
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });
    return mapPostClinicalHistory(post);
  },

  /**
   * Update an existing post. Returns the updated record.
   */
  async update(id: string, data: Prisma.PostUpdateInput) {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            profilePictureUrl: true,
            contact: true,
            contactType: true,
          },
        },
        clinicalHistory: {
          include: {
            entries: {
              orderBy: { date: "asc" },
            },
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });
    return mapPostClinicalHistory(post);
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
    if (filters.gender) {
      where.gender = filters.gender;
    }
    // ── Locality filter ──────────────────────────
    // Cuando hay una localidad normalizada (Georef) se filtra por
    // pertenencia real: ID exacto de localidad o su contenedor
    // administrativo. El match textual queda como fallback en el OR
    // para posts todavía no normalizados.
    const areaConditions: Prisma.PostWhereInput[] = [];
    if (filters.areaFilter?.localityId) {
      areaConditions.push({ localityId: filters.areaFilter.localityId });
    }
    if (filters.areaFilter?.municipalityId) {
      areaConditions.push({ municipalityId: filters.areaFilter.municipalityId });
    }
    if (filters.areaFilter?.departmentId) {
      areaConditions.push({ departmentId: filters.areaFilter.departmentId });
    }
    if (filters.areaFilter?.provinceId) {
      areaConditions.push({ provinceId: filters.areaFilter.provinceId });
    }
    if (filters.location) {
      areaConditions.push({
        location: { contains: filters.location, mode: "insensitive" },
      });
    }
    if (areaConditions.length > 0) {
      where.OR = areaConditions;
    }
    if (filters.q) {
      where.name = { contains: filters.q, mode: "insensitive" };
    }
    if (filters.status) {
      where.status = filters.status as any;
    } else if (!filters.userId) {
      where.status = { not: "ADOPTADO" as any };
    }

    // ── Range filters ────────────────────────────
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      where.age = {
        ...(filters.minAge !== undefined && { gte: filters.minAge }),
        ...(filters.maxAge !== undefined && { lte: filters.maxAge }),
      };
    }

    if (filters.neutered !== undefined) {
      where.neutered = filters.neutered;
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
              profilePictureUrl: true,
            },
          },
          clinicalHistory: {
            include: {
              entries: {
                orderBy: { date: "asc" },
              },
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
      posts: posts.map(mapPostClinicalHistory),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};