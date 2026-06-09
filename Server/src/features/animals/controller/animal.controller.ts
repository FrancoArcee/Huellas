// ───────────────────────────────────────────────
//  Animal Controller — Express request handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import { createPostSchema, updatePostSchema, postSearchSchema } from "@huellas/shared";
import { animalService, PostNotFoundError, ForbiddenError } from "../service/animal.service";

// ─── Handlers ──────────────────────────────────

/**
 * POST /animals
 * Create a new post (animal publication).
 * Requires authentication.
 */
export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
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
    next(error);
  }
}

/**
 * GET /animals
 * List posts with optional filters and pagination.
 * Public endpoint (no authentication required).
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

    const { q, category, size, location, page, limit } = parsed.data;
    const result = await animalService.listPosts(
      { q, category, size, location },
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
 * Retrieve a single post by ID.
 * Public endpoint (no authentication required).
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
 * PUT /animals/:id
 * Update a post. The requester must be the owner.
 */
export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);

    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const updatedPost = await animalService.updatePost(id, parsed.data, req.user!.id);

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
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

/**
 * DELETE /animals/:id
 * Delete a post. The requester must be the owner.
 */
export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);

    await animalService.deletePost(id, req.user!.id);

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