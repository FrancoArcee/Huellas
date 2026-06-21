import { FavoriteRepository } from "../repository/favorite.repository";
import prisma from "../../../config/database";
import { HttpError } from "../../../shared/errors/HttpError";

export const FavoriteService = {
  async addFavorite(postId: string, userId: string) {
    // 1. Verify the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw HttpError.notFound("Post not found");
    }

    // 2. Check for duplicate favorite (unique constraint: postId + userId)
    const existing = await FavoriteRepository.findByUserAndPost(userId, postId);
    if (existing) {
      throw HttpError.conflict("Favorite already exists for this post");
    }

    // 3. Create and return the favorite
    return FavoriteRepository.create({ postId, userId });
  },

  async getFavorite(id: string, requestingUserId: string) {
    const favorite = await FavoriteRepository.findById(id);
    if (!favorite) {
      throw HttpError.notFound("Favorite not found");
    }
    if (favorite.userId !== requestingUserId) {
      throw HttpError.forbidden("You do not own this favorite");
    }
    return favorite;
  },

  async removeFavorite(id: string, requestingUserId: string): Promise<void> {
    const favorite = await FavoriteRepository.findById(id);
    if (!favorite) {
      throw HttpError.notFound("Favorite not found");
    }
    if (favorite.userId !== requestingUserId) {
      throw HttpError.forbidden("You do not own this favorite");
    }
    await FavoriteRepository.delete(id);
  },

  async listUserFavorites(userId: string, page?: number, limit?: number) {
    return FavoriteRepository.listByUser(userId, page, limit);
  },

  async getByUserAndPost(postId: string, userId: string) {
    return FavoriteRepository.findByUserAndPost(userId, postId);
  },
};
