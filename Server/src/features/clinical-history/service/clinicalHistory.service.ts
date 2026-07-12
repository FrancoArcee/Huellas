import prisma from "../../../config/database";
import { HttpError } from "../../../shared/errors/HttpError";
import { clinicalHistoryRepository } from "../repository/clinicalHistory.repository";

// ─── Types ─────────────────────────────────────

export interface CreateEntryData {
  eventType: "VACUNACION" | "DESPARASITACION" | "CONSULTA_GENERAL" | "CIRUGIA" | "DIAGNOSTICO" | "CHEQUEO_PREVENTIVO" | "OTRO";
  title: string;
  description: string;
  date: string;
  documentsUrl?: string[];
}

export interface UpdateEntryData {
  eventType?: CreateEntryData["eventType"];
  title?: string;
  description?: string;
  date?: string;
  documentsUrl?: string[];
}

// ─── Service ───────────────────────────────────

export const clinicalHistoryService = {
  // ─── Local Mobile compatible methods ─────────────────────

  async getPostClinicalHistory(postId: string) {
    const history = await prisma.clinicalHistory.findUnique({
      where: { postId },
      include: {
        entries: {
          orderBy: { date: "asc" },
        },
      },
    });
    const entries = history?.entries ?? [];
    return entries.map((entry) => ({
      id: entry.id,
      postId: postId,
      type: entry.eventType,
      name: entry.name || entry.title || "",
      date: entry.date,
      veterinary: entry.veterinary || "",
      veterinarian: entry.veterinarian || "",
      comprobante: entry.documentsUrl?.[0] || "",
      description: entry.description,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));
  },

  async createItem(postId: string, data: any, requestingUserId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (!post) {
      throw HttpError.notFound(`Post with id "${postId}" not found`);
    }
    if (post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para agregar historial clínico a esta publicación");
    }

    let history = await prisma.clinicalHistory.findUnique({
      where: { postId },
    });
    if (!history) {
      history = await prisma.clinicalHistory.create({
        data: { postId },
      });
    }

    const entry = await prisma.clinicalHistoryEntry.create({
      data: {
        clinicalHistory: { connect: { id: history.id } },
        date: new Date(data.date),
        eventType: data.type,
        title: data.name,
        description: data.description || "",
        documentsUrl: data.comprobante ? [data.comprobante] : [],
        name: data.name,
        veterinary: data.veterinary || "",
        veterinarian: data.veterinarian || "",
      },
    });

    return {
      id: entry.id,
      postId: postId,
      type: entry.eventType,
      name: entry.name || entry.title || "",
      date: entry.date,
      veterinary: entry.veterinary || "",
      veterinarian: entry.veterinarian || "",
      comprobante: entry.documentsUrl?.[0] || "",
      description: entry.description,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  },

  async updateItem(itemId: string, data: any, requestingUserId: string) {
    const existing = await prisma.clinicalHistoryEntry.findUnique({
      where: { id: itemId },
      include: {
        clinicalHistory: {
          include: {
            post: {
              select: { userId: true },
            },
          },
        },
      },
    });
    if (!existing) {
      throw HttpError.notFound(`Item de historial clínico con id "${itemId}" no encontrado`);
    }
    if (existing.clinicalHistory.post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para modificar este ítem de historial clínico");
    }

    const updateData: any = {};
    if (data.type !== undefined) updateData.eventType = data.type;
    if (data.name !== undefined) {
      updateData.title = data.name;
      updateData.name = data.name;
    }
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.veterinary !== undefined) updateData.veterinary = data.veterinary;
    if (data.veterinarian !== undefined) updateData.veterinarian = data.veterinarian;
    if (data.comprobante !== undefined) {
      updateData.documentsUrl = data.comprobante ? [data.comprobante] : [];
    }
    if (data.description !== undefined) updateData.description = data.description || "";

    const entry = await prisma.clinicalHistoryEntry.update({
      where: { id: itemId },
      data: updateData,
    });

    return {
      id: entry.id,
      postId: existing.clinicalHistory.postId,
      type: entry.eventType,
      name: entry.name || entry.title || "",
      date: entry.date,
      veterinary: entry.veterinary || "",
      veterinarian: entry.veterinarian || "",
      comprobante: entry.documentsUrl?.[0] || "",
      description: entry.description,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  },

  async deleteItem(itemId: string, requestingUserId: string) {
    const existing = await prisma.clinicalHistoryEntry.findUnique({
      where: { id: itemId },
      include: {
        clinicalHistory: {
          include: {
            post: {
              select: { userId: true },
            },
          },
        },
      },
    });
    if (!existing) {
      throw HttpError.notFound(`Item de historial clínico con id "${itemId}" no encontrado`);
    }
    if (existing.clinicalHistory.post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para eliminar este ítem de historial clínico");
    }

    await prisma.clinicalHistoryEntry.delete({
      where: { id: itemId },
    });

    return {
      id: existing.id,
      postId: existing.clinicalHistory.postId,
      type: existing.eventType,
      name: existing.name || existing.title || "",
      date: existing.date,
      veterinary: existing.veterinary || "",
      veterinarian: existing.veterinarian || "",
      comprobante: existing.documentsUrl?.[0] || "",
      description: existing.description,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
    };
  },

  // ─── Remote main compatible methods ─────────────────────

  async getEntryById(entryId: string) {
    return clinicalHistoryRepository.findEntryById(entryId);
  },

  async getClinicalHistoryByPostId(postId: string, requestingUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (!post) {
      throw HttpError.notFound("Post not found");
    }

    let history = await clinicalHistoryRepository.findByPostId(postId, true);
    if (!history) {
      await clinicalHistoryRepository.createForPost(postId);
      history = await clinicalHistoryRepository.findByPostId(postId, true);
    }

    return history;
  },

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
      documentsUrl: data.documentsUrl ?? [],
    });
  },

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
      ...(data.documentsUrl !== undefined && { documentsUrl: data.documentsUrl }),
    });
  },

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
