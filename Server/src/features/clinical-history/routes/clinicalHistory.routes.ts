// ───────────────────────────────────────────────
//  Clinical History Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { uploadClinical } from "../../../shared/middleware/clinicalHistoryUploadMiddleware";
import {
  getClinicalHistory,
  createClinicalHistoryItem,
  updateClinicalHistoryItem,
  deleteClinicalHistoryItem,
} from "../controller/clinicalHistory.controller";

const router = Router();

/**
 * GET /animals/:postId/clinical-history
 * List all clinical history items for a post.
 */
router.get("/:postId/clinical-history", requireAuth, getClinicalHistory);

/**
 * POST /animals/:postId/clinical-history
 * Create a new clinical history item for a post.
 */
router.post("/:postId/clinical-history", requireAuth, uploadClinical.single("comprobante"), createClinicalHistoryItem);

/**
 * PUT /animals/:postId/clinical-history/:itemId
 * Update a clinical history item.
 */
router.put("/:postId/clinical-history/:itemId", requireAuth, uploadClinical.single("comprobante"), updateClinicalHistoryItem);

/**
 * DELETE /animals/:postId/clinical-history/:itemId
 * Delete a clinical history item.
 */
router.delete("/:postId/clinical-history/:itemId", requireAuth, deleteClinicalHistoryItem);

export default router;
