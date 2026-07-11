// ───────────────────────────────────────────────
//  Clinical History Repository — Prisma operations
// ───────────────────────────────────────────────

import prisma from "../../../config/database";
import type { Prisma } from "@prisma/client";

export const clinicalHistoryRepository = {
  async findById(id: string) {
    return prisma.clinicalHistoryItem.findUnique({
      where: { id },
      include: {
        post: true,
      },
    });
  },

  async findByPostId(postId: string) {
    return prisma.clinicalHistoryItem.findMany({
      where: { postId },
      orderBy: { date: "asc" }, // Ascending order so they appear chronologically in the horizontal list
    });
  },

  async create(data: Prisma.ClinicalHistoryItemCreateInput) {
    return prisma.clinicalHistoryItem.create({ data });
  },

  async update(id: string, data: Prisma.ClinicalHistoryItemUpdateInput) {
    return prisma.clinicalHistoryItem.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.clinicalHistoryItem.delete({
      where: { id },
    });
  },
};
