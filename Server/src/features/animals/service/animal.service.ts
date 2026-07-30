import prisma from "../../../config/database";
import { animalRepository } from "../repository/animal.repository";
import {
  locationService,
  type AreaFilter,
} from "../../locations/service/location.service";

/**
 * Normaliza la ubicación del post (provincia / departamento / municipio /
 * localidad Georef) a partir de sus coordenadas y placeId. Devuelve {}
 * si faltan coordenadas o Georef no responde: la creación no debe fallar
 * por esto (el post sigue siendo encontrable por radio).
 */
async function normalizedAreaFields(
  latitude: unknown,
  longitude: unknown,
  placeId: unknown,
): Promise<Record<string, string | null>> {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return {};
  }
  const area = await locationService.normalizeArea(
    latitude,
    longitude,
    typeof placeId === "string" ? placeId : undefined,
  );
  return area ? { ...area } : {};
}

export class PostNotFoundError extends Error {
  public statusCode: number = 404;
  constructor(message: string = "Post not found") {
    super(message);
    this.name = "PostNotFoundError";
  }
}

export class ForbiddenError extends Error {
  public statusCode: number = 403;
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const animalService = {
  /**
   * Obtiene un post por ID. Lanza 404 si no existe.
   */
  async getPost(id: string) {
    const post = await animalRepository.findById(id);
    if (!post) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    return post;
  },

  /**
   * Crea un nuevo post. El userId viene del usuario autenticado.
   */
  async createPost(data: Record<string, unknown>, userId: string) {
    const { userId: _ignoredUserId, ...postData } = data;
    const areaFields = await normalizedAreaFields(
      postData.latitude,
      postData.longitude,
      postData.placeId,
    );
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          ...postData,
          ...areaFields,
          user: {
            connect: { id: userId },
          },
        } as any,
      });

      await tx.clinicalHistory.create({
        data: { postId: post.id },
      });

      return post;
    });
  },

  /**
   * Actualiza un post. Solo el dueño puede hacerlo.
   * Lanza 403 si no es el propietario.
   */
  async updatePost(id: string, data: Record<string, unknown>, requestingUserId: string) {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    if (existing.userId !== requestingUserId) {
      throw new ForbiddenError("You are not allowed to update this post");
    }

    // Re-normaliza la localidad si cambió la ubicación del post
    const locationChanged =
      data.latitude !== undefined ||
      data.longitude !== undefined ||
      data.placeId !== undefined;
    const areaFields = locationChanged
      ? await normalizedAreaFields(
          data.latitude ?? existing.latitude,
          data.longitude ?? existing.longitude,
          data.placeId ?? existing.placeId,
        )
      : {};

    return animalRepository.update(id, { ...data, ...areaFields });
  },

  /**
   * Elimina un post. Solo el dueño puede hacerlo.
   * Lanza 403 si no es el propietario.
   */
  async deletePost(id: string, requestingUserId: string): Promise<void> {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    if (existing.userId !== requestingUserId) {
      throw new ForbiddenError("You are not allowed to delete this post");
    }

    await animalRepository.delete(id);
  },

  /**
   * Lista posts con filtros opcionales, búsqueda geográfica y paginación.
   *
   * Cuando `placeId` referencia una localidad Georef, se resuelve a
   * normalized area conditions (locality / municipality / department)
   * so posts are matched by real geographic containment instead of
   * matching the free-text location field.
   */
  async listPosts(
    filters: {
      category?: string;
      size?: string;
      gender?: string;
      status?: string;
      location?: string;
      placeId?: string;
      q?: string;
      latitude?: number;
      longitude?: number;
      radius?: number;
      minAge?: number;
      maxAge?: number;
      neutered?: boolean;
      userId?: string;
    },
    page?: number,
    limit?: number,
  ) {
    let areaFilter: AreaFilter | undefined;
    if (filters.placeId) {
      try {
        areaFilter = (await locationService.resolveAreaFilter(filters.placeId)) ?? undefined;
      } catch (error) {
        // Georef caído: degradamos al filtro textual sin romper la búsqueda
        console.error("resolveAreaFilter error:", error);
      }
    }
    return animalRepository.list({ ...filters, areaFilter }, page, limit);
  },
};