// ───────────────────────────────────────────────
//  User Controller — Express request handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import { createUserSchema, updateUserSchema } from "@huellas/shared";
import { userService, UserNotFoundError, ForbiddenError } from "../service/user.service";

// ─── Handlers ──────────────────────────────────

/**
 * POST /users
 * Create a new user via Better Auth sign-up.
 * Body validated with createUserSchema.
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Validate request body with Zod
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password, contact, contactType, profilePictureUrl } = parsed.data;

    // 2. Use Better Auth sign-up to create the user
    const auth = req.app.locals.auth as any;

    const newUser = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        contact,
        contactType,
        ...(profilePictureUrl && { profilePictureUrl }),
      },
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error: any) {
    // Mejorar errores de Better Auth
    if (error?.statusCode === 422 || error?.status === 422) {
      res.status(409).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }
    next(error);
  }
}

/**
 * GET /users/:id
 * Retrieve a user by their ID.
 */
export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const user = await userService.getUser(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * PUT /users/:id
 * Update a user. The requester must be the owner (req.user.id === id).
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);

    // 1. Validate request body with Zod
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    // 2. Ownership check
    if (!req.user || req.user.id !== id) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to update this user",
      });
      return;
    }

    const updatedUser = await userService.updateUser(id, parsed.data, req.user.id);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof ForbiddenError) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * DELETE /users/:id
 * Delete a user. The requester must be the owner (req.user.id === id).
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);

    // 1. Ownership check
    if (!req.user || req.user.id !== id) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to delete this user",
      });
      return;
    }

    await userService.deleteUser(id, req.user.id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof ForbiddenError) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
