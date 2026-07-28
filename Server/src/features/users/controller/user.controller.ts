// ───────────────────────────────────────────────
//  User Controller — Express request handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createUserSchema, updateUserSchema } from "@huellas/shared";
import { auth } from "../../../config/auth";
import { userService, UserNotFoundError, ForbiddenError, ContactAlreadyInUseError } from "../service/user.service";
import { isCloudinaryEnabled, uploadToCloudinary } from "../../../config/cloudinary";

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

    // Handle Prisma unique constraint violation for (contact, contactType)
    if (error?.code === "P2002") {
      const targetFields: string[] = error?.meta?.target ?? [];
      if (
        targetFields.includes("contact") &&
        targetFields.includes("contactType")
      ) {
        res.status(409).json({
          success: false,
          message: "El contacto ya está en uso por otro usuario",
        });
        return;
      }
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
    if (error instanceof ContactAlreadyInUseError) {
      res.status(409).json({ success: false, message: error.message });
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

/**
 * POST /users/upload
 * Public endpoint to upload a profile picture.
 */
export async function uploadProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    // Con Cloudinary configurado, la foto va a la nube (persistente)
    if (isCloudinaryEnabled) {
      const fileUrl = await uploadToCloudinary(req.file.buffer, "users");
      res.status(200).json({
        success: true,
        url: fileUrl,
      });
      return;
    }

    // Ensure uploads/user directory exists
    const uploadsDir = path.join(process.cwd(), "uploads", "user");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename using uuid
    const ext = path.extname(req.file.originalname) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    try {
      fs.renameSync(req.file.path, filepath);
    } catch (err: any) {
      if (err.code === "EXDEV") {
        fs.copyFileSync(req.file.path, filepath);
        fs.unlinkSync(req.file.path);
      } else {
        throw err;
      }
    }

    // Construct public URL
    const host = req.get("host");
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/user/${filename}`;

    res.status(200).json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
}
