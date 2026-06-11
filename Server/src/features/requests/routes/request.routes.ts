// ───────────────────────────────────────────────
//  Request Routes — Express router
// ───────────────────────────────────────────────

import { Router } from "express";
import { searchPosts } from "../controller/request.controller";

const router = Router();

// ─── Public routes ─────────────────────────────

/**
 * GET /requests
 * Advanced search for posts with filters and pagination.
 */
router.get("/", searchPosts);

export default router;