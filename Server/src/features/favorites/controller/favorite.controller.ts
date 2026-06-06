import { Request, Response, NextFunction } from "express";
import { FavoriteService } from "../service/favorite.service";
import { sendSuccess } from "../../../shared/utils/response";

export const FavoriteController = {
  /**
   * POST /favorites
   * Crea un nuevo favorito (autenticado).
   * Valida que userId en el body coincida con el usuario autenticado.
   */
  async createFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.body;
      const userId = req.user!.id;

      // Validación manual básica
      if (!postId) {
        res.status(400).json({ error: "postId is required" });
        return;
      }

      const favorite = await FavoriteService.addFavorite(postId, userId);
      sendSuccess(res, favorite, "Favorito creado", 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /favorites/:id
   * Obtiene un favorito por ID (autenticado + ownership).
   */
  async getFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const favorite = await FavoriteService.getFavorite(id, req.user!.id);
      sendSuccess(res, favorite);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /favorites/:id
   * Elimina un favorito (autenticado + dueño).
   */
  async deleteFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await FavoriteService.removeFavorite(id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
