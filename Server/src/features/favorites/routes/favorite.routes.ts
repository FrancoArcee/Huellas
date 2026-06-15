import { Router } from "express";
import { FavoriteController } from "../controller/favorite.controller";
import { requireAuth } from "../../../shared/middleware/authMiddleware";
import { validate } from "../../../shared/middleware/validateRequest";
import { createFavoriteSchema } from "@huellas/shared";

const router = Router();

/**
 * POST   /favorites          → Crear favorito (autenticado)
 * GET    /favorites/:id      → Obtener favorito (autenticado + ownership)
 * DELETE /favorites/:id      → Eliminar favorito (autenticado + dueño)
 */
router.post("/", requireAuth, validate(createFavoriteSchema), FavoriteController.createFavorite);
router.get("/:id", requireAuth, FavoriteController.getFavorite);
router.delete("/:id", requireAuth, FavoriteController.deleteFavorite);

export default router;
