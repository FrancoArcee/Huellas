// ───────────────────────────────────────────────
//  Animal Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controller/animal.controller";

const router = Router();

// ─── Public routes ─────────────────────────────

/**
 * GET /animals
 * List posts with optional filters and pagination.
 */
router.get("/", listPosts);

/**
 * GET /animals/:id
 * Retrieve a single post by ID.
 */
router.get("/:id", getPost);

// ─── Protected routes (require authentication) ─

/**
 * POST /animals
 * Create a new post (animal publication).
 */
router.post("/", requireAuth, createPost);

/**
 * PUT /animals/:id
 * Update a post (owner only).
 */
router.put("/:id", requireAuth, updatePost);

/**
 * DELETE /animals/:id
 * Delete a post (owner only).
 */
router.delete("/:id", requireAuth, deletePost);

export default router;