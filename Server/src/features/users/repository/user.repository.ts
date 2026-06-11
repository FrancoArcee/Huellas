// ───────────────────────────────────────────────
//  User Repository — Prisma operations for User
// ───────────────────────────────────────────────

import type { Prisma } from "@prisma/client";
import prisma from "../../../config/database";

// ─── Types ─────────────────────────────────────

export interface PaginatedUsers {
  users: Array<Record<string, unknown>>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Repository ────────────────────────────────

export const userRepository = {
  /**
   * Find a single user by their unique ID.
   * Includes related posts and a count of favorites.
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            name: true,
            category: true,
            size: true,
            location: true,
            photosUrl: true,
            createdAt: true,
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });
  },

  /**
   * Find a user by their email address (unique).
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find a user by the unique (contact, contactType) pair.
   */
  async findByContact(contact: string, contactType: string) {
    return prisma.user.findUnique({
      where: { contact_contactType: { contact, contactType } },
    });
  },

  /**
   * Create a new user record.
   */
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  /**
   * Update an existing user. Returns the updated record.
   */
  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a user by ID.
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },

  /**
   * List users with pagination.
   */
  async list(page: number = 1, limit: number = 20): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          contact: true,
          contactType: true,
          profilePictureUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
