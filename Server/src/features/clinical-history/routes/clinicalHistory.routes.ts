// ───────────────────────────────────────────────
//  Clinical History Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { createEntry } from "../controller/clinicalHistory.controller";

const router = Router();

/**
 * POST /clinical-histories/:id/entries
 * Add a new entry to a clinical history.
 */
router.post("/:id/entries", requireAuth, createEntry);

export default router;
