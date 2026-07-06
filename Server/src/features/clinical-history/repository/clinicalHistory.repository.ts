// ───────────────────────────────────────────────
//  Clinical History Repository — Prisma operations
// ───────────────────────────────────────────────

import type { Prisma } from "@prisma/client";
import prisma from "../../../config/database";

export const clinicalHistoryRepository = {
  /**
   * Find a clinical history by its associated post ID.
   * Optionally includes entries ordered by date descending.
   */
  async findByPostId(postId: string, includeEntries: boolean = false) {
    return prisma.clinicalHistory.findUnique({
      where: { postId },
      include: {
        entries: includeEntries
          ? {
              orderBy: { date: "desc" },
            }
          : false,
      },
    });
  },

  /**
   * Create a clinical history record for a given post.
   */
  async createForPost(postId: string) {
    return prisma.clinicalHistory.create({
      data: { postId },
    });
  },

  /**
   * Find a single clinical history entry by ID.
   */
  async findEntryById(id: string) {
    return prisma.clinicalHistoryEntry.findUnique({
      where: { id },
      include: {
        clinicalHistory: {
          select: { postId: true },
        },
      },
    });
  },

  /**
   * Create a new clinical history entry.
   */
  async createEntry(data: Prisma.ClinicalHistoryEntryCreateInput) {
    return prisma.clinicalHistoryEntry.create({ data });
  },

  /**
   * Update an existing clinical history entry.
   */
  async updateEntry(id: string, data: Prisma.ClinicalHistoryEntryUpdateInput) {
    return prisma.clinicalHistoryEntry.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a clinical history entry by ID.
   */
  async deleteEntry(id: string): Promise<void> {
    await prisma.clinicalHistoryEntry.delete({ where: { id } });
  },
};
