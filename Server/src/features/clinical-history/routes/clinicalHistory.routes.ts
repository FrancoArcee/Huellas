// ───────────────────────────────────────────────
//  Clinical History Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { clinicalUpload } from "../../../shared/middleware/uploadMiddleware";
import { createEntry } from "../controller/clinicalHistory.controller";

const router = Router();

router.post("/:id/entries", requireAuth, clinicalUpload.array("documents", 5), createEntry);

export default router;
