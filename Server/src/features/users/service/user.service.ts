// ───────────────────────────────────────────────
//  User Service — Business logic layer
// ───────────────────────────────────────────────

import { userRepository } from "../repository/user.repository";

// ─── Errors ────────────────────────────────────

export class UserNotFoundError extends Error {
  public statusCode: number = 404;
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
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

export const userService = {
  /**
   * Retrieve a single user by ID. Throws 404 if not found.
   */
  async getUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(`User with id "${id}" not found`);
    }
    return user;
  },

  /**
   * Update a user. Only the owner (requestingUserId === id) is allowed.
   * Throws 403 if the requester is not the owner.
   */
  async updateUser(id: string, data: Record<string, unknown>, requestingUserId: string) {
    if (requestingUserId !== id) {
      throw new ForbiddenError("You are not allowed to update this user");
    }

    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(`User with id "${id}" not found`);
    }

    return userRepository.update(id, data);
  },

  /**
   * Delete a user. Only the owner (requestingUserId === id) is allowed.
   * Throws 403 if the requester is not the owner.
   */
  async deleteUser(id: string, requestingUserId: string): Promise<void> {
    if (requestingUserId !== id) {
      throw new ForbiddenError("You are not allowed to delete this user");
    }

    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(`User with id "${id}" not found`);
    }

    await userRepository.delete(id);
  },

  /**
   * List users with pagination.
   */
  async listUsers(page: number = 1, limit: number = 20) {
    return userRepository.list(page, limit);
  },
};
