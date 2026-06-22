// ───────────────────────────────────────────────
//  User Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { upload } from "../../../shared/middleware/uploadMiddleware";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
} from "../controller/user.controller";

const router = Router();

// ─── Public routes ─────────────────────────────

/**
 * POST /users
 * Register a new user via Better Auth.
 * No authentication required.
 */
router.post("/", createUser);

/**
 * POST /users/upload
 * Upload a profile picture.
 * No authentication required to allow upload during sign-up.
 */
router.post("/upload", upload.single("image"), uploadProfilePicture);

// ─── Protected routes (require authentication) ─

/**
 * GET /users/:id
 * Retrieve a user profile.
 */
router.get("/:id", requireAuth, getUser);

/**
 * PUT /users/:id
 * Update a user profile (owner only).
 */
router.put("/:id", requireAuth, updateUser);

/**
 * DELETE /users/:id
 * Delete a user account (owner only).
 */
router.delete("/:id", requireAuth, deleteUser);

export default router;
