// ───────────────────────────────────────────────
//  Clinical History Service — Business logic layer
// ───────────────────────────────────────────────

import prisma from "../../../config/database";
import { HttpError } from "../../../shared/errors/HttpError";
import { clinicalHistoryRepository } from "../repository/clinicalHistory.repository";

// ─── Types ─────────────────────────────────────

export interface CreateEntryData {
  eventType: "VACUNACION" | "DESPARASITACION" | "CONSULTA_GENERAL" | "CIRUGIA" | "DIAGNOSTICO";
  title: string;
  description: string;
  date: string;
  documentUrl?: string;
}

export interface UpdateEntryData {
  eventType?: CreateEntryData["eventType"];
  title?: string;
  description?: string;
  date?: string;
  documentUrl?: string;
}

// ─── Service ───────────────────────────────────

export const clinicalHistoryService = {
  /**
   * Retrieve the clinical history associated with a post.
   * Creates it if it does not exist yet.
   * Only the post owner is allowed.
   */
  async getClinicalHistoryByPostId(postId: string, requestingUserId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (!post) {
      throw HttpError.notFound("Post not found");
    }
    if (post.userId !== requestingUserId) {
      throw HttpError.forbidden("You are not allowed to access this clinical history");
    }

    let history = await clinicalHistoryRepository.findByPostId(postId, true);
    if (!history) {
      await clinicalHistoryRepository.createForPost(postId);
      history = await clinicalHistoryRepository.findByPostId(postId, true);
    }

    return history;
  },

  /**
   * Add a new entry to a clinical history.
   * Only the post owner is allowed.
   */
  async createEntry(clinicalHistoryId: string, data: CreateEntryData, requestingUserId: string) {
    const history = await prisma.clinicalHistory.findUnique({
      where: { id: clinicalHistoryId },
      include: {
        post: {
          select: { userId: true },
        },
      },
    });
    if (!history) {
      throw HttpError.notFound("Clinical history not found");
    }
    if (history.post.userId !== requestingUserId) {
      throw HttpError.forbidden("You are not allowed to add entries to this clinical history");
    }

    return clinicalHistoryRepository.createEntry({
      clinicalHistory: { connect: { id: clinicalHistoryId } },
      date: new Date(data.date),
      eventType: data.eventType,
      title: data.title,
      description: data.description,
      documentUrl: data.documentUrl,
    });
  },

  /**
   * Update an existing clinical history entry.
   * Only the post owner is allowed.
   */
  async updateEntry(entryId: string, data: UpdateEntryData, requestingUserId: string) {
    const entry = await clinicalHistoryRepository.findEntryById(entryId);
    if (!entry) {
      throw HttpError.notFound("Clinical history entry not found");
    }

    const history = await prisma.clinicalHistory.findUnique({
      where: { id: entry.clinicalHistoryId },
      include: {
        post: {
          select: { userId: true },
        },
      },
    });
    if (!history) {
      throw HttpError.notFound("Clinical history not found");
    }
    if (history.post.userId !== requestingUserId) {
      throw HttpError.forbidden("You are not allowed to update this entry");
    }

    return clinicalHistoryRepository.updateEntry(entryId, {
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.eventType !== undefined && { eventType: data.eventType }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
    });
  },

  /**
   * Delete a clinical history entry.
   * Only the post owner is allowed.
   */
  async deleteEntry(entryId: string, requestingUserId: string): Promise<void> {
    const entry = await clinicalHistoryRepository.findEntryById(entryId);
    if (!entry) {
      throw HttpError.notFound("Clinical history entry not found");
    }

    const history = await prisma.clinicalHistory.findUnique({
      where: { id: entry.clinicalHistoryId },
      include: {
        post: {
          select: { userId: true },
        },
      },
    });
    if (!history) {
      throw HttpError.notFound("Clinical history not found");
    }
    if (history.post.userId !== requestingUserId) {
      throw HttpError.forbidden("You are not allowed to delete this entry");
    }

    await clinicalHistoryRepository.deleteEntry(entryId);
  },
};
