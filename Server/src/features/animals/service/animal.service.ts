// ───────────────────────────────────────────────
//  Animal Service — Business logic layer
// ───────────────────────────────────────────────

import { animalRepository } from "../repository/animal.repository";

// ─── Errors ────────────────────────────────────

export class PostNotFoundError extends Error {
  public statusCode: number = 404;
  constructor(message: string = "Post not found") {
    super(message);
    this.name = "PostNotFoundError";
  }
}

export class ForbiddenError extends Error {
  public statusCode: number = 403;
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// ─── Service ───────────────────────────────────

export const animalService = {
  /**
   * Retrieve a single post by ID. Throws 404 if not found.
   */
  async getPost(id: string) {
    const post = await animalRepository.findById(id);
    if (!post) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    return post;
  },

  /**
   * Create a new post. The userId comes from the authenticated user.
   */
  async createPost(data: Record<string, unknown>, userId: string) {
    return animalRepository.create({
      ...data,
      userId,
    } as any);
  },

  /**
   * Update a post. Only the owner (requestingUserId === post.userId) is allowed.
   * Throws 403 if the requester is not the owner.
   */
  async updatePost(id: string, data: Record<string, unknown>, requestingUserId: string) {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    if (existing.userId !== requestingUserId) {
      throw new ForbiddenError("You are not allowed to update this post");
    }

    return animalRepository.update(id, data);
  },

  /**
   * Delete a post. Only the owner (requestingUserId === post.userId) is allowed.
   * Throws 403 if the requester is not the owner.
   */
  async deletePost(id: string, requestingUserId: string): Promise<void> {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new PostNotFoundError(`Post with id "${id}" not found`);
    }
    if (existing.userId !== requestingUserId) {
      throw new ForbiddenError("You are not allowed to delete this post");
    }

    await animalRepository.delete(id);
  },

  /**
   * List posts with optional filters and pagination.
   */
  async listPosts(
    filters: {
      category?: string;
      size?: string;
      location?: string;
      q?: string;
    },
    page?: number,
    limit?: number,
  ) {
    return animalRepository.list(filters, page, limit);
  },
};