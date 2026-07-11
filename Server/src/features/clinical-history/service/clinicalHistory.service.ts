// ───────────────────────────────────────────────
//  Clinical History Service — Business logic layer
// ───────────────────────────────────────────────

import { clinicalHistoryRepository } from "../repository/clinicalHistory.repository";
import { animalRepository } from "../../animals/repository/animal.repository";
import { HttpError } from "../../../shared/errors/HttpError";

export const clinicalHistoryService = {
  async getPostClinicalHistory(postId: string) {
    const post = await animalRepository.findById(postId);
    if (!post) {
      throw HttpError.notFound(`Post with id "${postId}" not found`);
    }
    return clinicalHistoryRepository.findByPostId(postId);
  },

  async createItem(postId: string, data: any, requestingUserId: string) {
    const post = await animalRepository.findById(postId);
    if (!post) {
      throw HttpError.notFound(`Post with id "${postId}" not found`);
    }
    if (post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para agregar historial clínico a esta publicación");
    }

    return clinicalHistoryRepository.create({
      type: data.type,
      name: data.name,
      date: new Date(data.date),
      veterinary: data.veterinary,
      veterinarian: data.veterinarian,
      comprobante: data.comprobante,
      description: data.description || null,
      post: {
        connect: { id: postId },
      },
    });
  },

  async updateItem(itemId: string, data: any, requestingUserId: string) {
    const existing = await clinicalHistoryRepository.findById(itemId);
    if (!existing) {
      throw HttpError.notFound(`Item de historial clínico con id "${itemId}" no encontrado`);
    }
    if (existing.post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para modificar este ítem de historial clínico");
    }

    const updateData: any = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.veterinary !== undefined) updateData.veterinary = data.veterinary;
    if (data.veterinarian !== undefined) updateData.veterinarian = data.veterinarian;
    if (data.comprobante !== undefined) updateData.comprobante = data.comprobante;
    if (data.description !== undefined) updateData.description = data.description || null;

    return clinicalHistoryRepository.update(itemId, updateData);
  },

  async deleteItem(itemId: string, requestingUserId: string) {
    const existing = await clinicalHistoryRepository.findById(itemId);
    if (!existing) {
      throw HttpError.notFound(`Item de historial clínico con id "${itemId}" no encontrado`);
    }
    if (existing.post.userId !== requestingUserId) {
      throw HttpError.forbidden("No tenés permisos para eliminar este ítem de historial clínico");
    }

    await clinicalHistoryRepository.delete(itemId);
    return existing;
  },
};
