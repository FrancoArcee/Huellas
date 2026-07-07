// ───────────────────────────────────────────────
//  Clinical History Entry Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { clinicalUpload } from "../../../shared/middleware/uploadMiddleware";
import {
  updateEntry,
  deleteEntry,
} from "../controller/clinicalHistory.controller";

const router = Router();

router.put("/:id", requireAuth, clinicalUpload.array("documents", 5), updateEntry);
router.delete("/:id", requireAuth, deleteEntry);

export default router;
