import { Router } from "express";
import { FavoriteController } from "../controller/favorite.controller";
import { requireAuth } from "../../../shared/middleware/authMiddleware";

const router = Router();

/**
 * POST   /favorites          → Crear favorito (autenticado)
 * GET    /favorites/check/:postId → Verifica favorito por postId (autenticado)
 * GET    /favorites/:id      → Obtener favorito (autenticado + ownership)
 * DELETE /favorites/:id      → Eliminar favorito (autenticado + dueño)
 *
 * Nota: createFavoriteSchema requería userId como UUID en el body, pero el
 * controller lo extrae del token autenticado. Se omite el middleware validate
 * para evitar esa validación redundante (el controller valida postId inline).
 */
router.post("/", requireAuth, FavoriteController.createFavorite);
router.get("/check/:postId", requireAuth, FavoriteController.checkFavoriteByPost);
router.get("/:id", requireAuth, FavoriteController.getFavorite);
router.delete("/:id", requireAuth, FavoriteController.deleteFavorite);

export default router;
