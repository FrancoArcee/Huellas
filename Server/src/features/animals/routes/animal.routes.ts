// ───────────────────────────────────────────────
//  Animal Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { upload } from "../../../shared/middleware/uploadMiddleware";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  getClinicalHistory,
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
 * GET /animals/:id/clinical-history
 * Retrieve the clinical history of a post (any authenticated user).
 */
router.get("/:id/clinical-history", requireAuth, getClinicalHistory);

// ─── Protected routes (require authentication) ─

/**
 * POST /animals
 * Create a new post (animal publication).
 */
router.post("/", requireAuth, upload.array("photos", 3), createPost);

/**
 * PUT /animals/:id
 * Update a post (owner only).
 */
router.put("/:id", requireAuth, upload.array("photos", 3), updatePost);

/**
 * DELETE /animals/:id
 * Delete a post (owner only).
 */
router.delete("/:id", requireAuth, deletePost);

export default router;
