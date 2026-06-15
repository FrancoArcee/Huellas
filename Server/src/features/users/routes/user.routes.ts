// ───────────────────────────────────────────────
//  User Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller";

const router = Router();

// ─── Public routes ─────────────────────────────

/**
 * POST /users
 * Register a new user via Better Auth.
 * No authentication required.
 */
router.post("/", createUser);

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
