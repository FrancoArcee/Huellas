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

/**
 * GET /animals/:id/clinical-history
 * Obtiene el historial clínico de un post (cualquier usuario autenticado).
 */
router.get("/:id/clinical-history", requireAuth, getClinicalHistory);

/**
 * POST /animals
 * Crea un nuevo post (publicación de animal).
 */
router.post("/", requireAuth, upload.array("photos", 3), createPost);

/**
 * PUT /animals/:id
 * Actualiza un post (solo dueño).
 */
router.put("/:id", requireAuth, upload.array("photos", 3), updatePost);

/**
 * DELETE /animals/:id
 * Elimina un post (solo dueño).
 */
router.delete("/:id", requireAuth, deletePost);

export default router;
