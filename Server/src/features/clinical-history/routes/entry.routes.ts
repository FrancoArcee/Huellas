// ───────────────────────────────────────────────
//  Clinical History Entry Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import {
  updateEntry,
  deleteEntry,
} from "../controller/clinicalHistory.controller";

const router = Router();

/**
 * PUT /entries/:id
 * Update a clinical history entry.
 */
router.put("/:id", requireAuth, updateEntry);

/**
 * DELETE /entries/:id
 * Delete a clinical history entry.
 */
router.delete("/:id", requireAuth, deleteEntry);

export default router;
