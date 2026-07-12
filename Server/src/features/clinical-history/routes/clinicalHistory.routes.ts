// ───────────────────────────────────────────────
//  Clinical History Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { uploadClinical } from "../../../shared/middleware/clinicalHistoryUploadMiddleware";
import { clinicalUpload } from "../../../shared/middleware/uploadMiddleware";
import {
  createClinicalHistoryItem,
  updateClinicalHistoryItem,
  deleteClinicalHistoryItem,
  createEntry,
} from "../controller/clinicalHistory.controller";

const router = Router();

// Local branch endpoints (mobile app compatible)
router.post("/:postId/clinical-history", requireAuth, uploadClinical.single("comprobante"), createClinicalHistoryItem);
router.put("/:postId/clinical-history/:itemId", requireAuth, uploadClinical.single("comprobante"), updateClinicalHistoryItem);
router.delete("/:postId/clinical-history/:itemId", requireAuth, deleteClinicalHistoryItem);

// Remote main endpoint
router.post("/:id/entries", requireAuth, clinicalUpload.array("documents", 5), createEntry);

export default router;
