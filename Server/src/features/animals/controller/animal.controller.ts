import type { Request, Response, NextFunction } from "express";
import { createPostSchema, updatePostSchema, postSearchSchema } from "@huellas/shared";
import { animalService, PostNotFoundError, ForbiddenError } from "../service/animal.service";
import { clinicalHistoryService } from "../../clinical-history/service/clinicalHistory.service";
import {
  persistAnimalPhotos,
  removeAnimalUploads,
} from "../../../shared/middleware/uploadMiddleware";

function getFiles(req: Request): Express.Multer.File[] {
  return (req.files as Express.Multer.File[] | undefined) ?? [];
}

function getBaseUrl(req: Request): string {
  return `${req.protocol}://${req.get("host")}`;
}

function parseExistingPhotos(value: unknown): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function normalizePostBody(body: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...body };

  for (const field of ["age", "weight", "latitude", "longitude"] as const) {
    if (typeof normalized[field] === "string" && normalized[field] !== "") {
      normalized[field] = Number(normalized[field]);
    }
  }

  if (typeof normalized.neutered === "string") {
    normalized.neutered = normalized.neutered === "true";
  }

  delete normalized.existingPhotosUrl;
  return normalized;
}

/**
 * POST /animals
 * Crear un nuevo post (animal publication).
 * requiere autenticación.
 */
export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  let newPhotos: string[] = [];
  try {
    newPhotos = await persistAnimalPhotos(getFiles(req), getBaseUrl(req));
    const parsed = createPostSchema.safeParse({
      ...normalizePostBody(req.body),
      photosUrl: newPhotos,
    });
    if (!parsed.success) {
      removeAnimalUploads(newPhotos);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.user!.id;
    const post = await animalService.createPost(parsed.data, userId);

    res.status(201).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    removeAnimalUploads(newPhotos);
    next(error);
  }
}

/**
 * GET /animals
 * Lista publicaciones con filtros opcionales, búsqueda geográfica y paginación.
 * Endpoint público (no requiere autenticación).
 *
 * Query params:
 *   q          – text search on pet name
 *   category   – filter by pet category (dog, cat, other)
 *   size       – filter by pet size (small, medium, large)
 *   location   – text search on location description
 *   placeId    – Georef place id of a locality; filters by real
 *                geographic containment (locality / municipality)
 *   latitude   – center latitude for geolocation search
 *   longitude  – center longitude for geolocation search
 *   radius     – search radius in km (requires latitude & longitude)
 *   minAge     – minimum age filter
 *   maxAge     – maximum age filter
 *   minWeight  – minimum weight filter
 *   maxWeight  – maximum weight filter
 *   userId     – filter by author
 *   page       – page number (default 1)
 *   limit      – items per page (default 20, max 100)
 */
export async function listPosts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = postSearchSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      q, category, size, gender, status, neutered, location, placeId,
      latitude, longitude, radius,
      minAge, maxAge,
      userId, page, limit,
    } = parsed.data;

    const result = await animalService.listPosts(
      {
        q, category, size, gender, status, neutered, location, placeId,
        latitude, longitude, radius,
        minAge, maxAge,
        userId,
      },
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /animals/:id
 * Obtiene un post por ID.
 * Endpoint público (no requiere autenticación).
 */
export async function getPost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const post = await animalService.getPost(id);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * GET /animals/:id/clinical-history
 * Obtiene el historial clínico de un post (cualquier usuario autenticado).
 */
export async function getClinicalHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const history = await clinicalHistoryService.getClinicalHistoryByPostId(
      id,
      req.user!.id,
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /animals/:id
 * Actualiza un post. El solicitante debe ser el dueño.
 */
export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  let newPhotos: string[] = [];
  try {
    newPhotos = await persistAnimalPhotos(getFiles(req), getBaseUrl(req));
    const id = String(req.params.id);
    const existingPost = await animalService.getPost(id);
    const retainedPhotos = parseExistingPhotos(req.body.existingPhotosUrl);

    const parsed = updatePostSchema.safeParse({
      ...normalizePostBody(req.body),
      photosUrl: [...retainedPhotos, ...newPhotos],
    });
    if (!parsed.success) {
      removeAnimalUploads(newPhotos);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const updatedPost = await animalService.updatePost(id, parsed.data, req.user!.id);
    const removedPhotos = existingPost.photosUrl.filter(
      (photoUrl: string) => !retainedPhotos.includes(photoUrl),
    );
    removeAnimalUploads(removedPhotos);

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    removeAnimalUploads(newPhotos);
    if (error instanceof PostNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof ForbiddenError) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * DELETE /animals/:id
 * Elimina un post. El solicitante debe ser el dueño.
 */
export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const existingPost = await animalService.getPost(id);

    await animalService.deletePost(id, req.user!.id);
    removeAnimalUploads(existingPost.photosUrl);

    res.status(204).send();
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof ForbiddenError) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
