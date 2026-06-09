// ───────────────────────────────────────────────
//  Validation — Zod schemas compartidos
// ───────────────────────────────────────────────

import { z } from "zod";

// ─── Enums ─────────────────────────────────────

export const contactTypeSchema = z.enum(["WhatsApp", "Telegram", "Instagram", "Discord"]);
export const petSizeSchema     = z.enum(["small", "medium", "large"]);
export const petCategorySchema = z.enum(["dog", "cat", "other"]);

// ─── User Schemas ──────────────────────────────

export const createUserSchema = z.object({
  name:             z.string().min(2).max(80),
  email:            z.string().email(),
  password:         z.string().min(6).max(128),
  contact:          z.string().min(3).max(60),
  contactType:      contactTypeSchema,
  profilePictureUrl: z.string().url().optional(),
});

export const updateUserSchema = z.object({
  name:             z.string().min(2).max(80).optional(),
  email:            z.string().email().optional(),
  password:         z.string().min(6).max(128).optional(),
  contact:          z.string().min(3).max(60).optional(),
  contactType:      contactTypeSchema.optional(),
  profilePictureUrl: z.string().url().optional(),
});

// ─── Post Schemas ──────────────────────────────

export const createPostSchema = z.object({
  userId:     z.string().uuid(),
  name:       z.string().min(1).max(100),
  age:        z.number().int().min(0).max(50),
  weight:     z.number().positive(),
  size:       petSizeSchema,
  category:   petCategorySchema,
  latitude:   z.number().min(-90).max(90),
  longitude:  z.number().min(-180).max(180),
  location:   z.string().min(1).max(200),
  birthDate:  z.string().datetime().optional(),
  description: z.string().max(1000).optional(),
  photosUrl:  z.array(z.string().url()).optional(),
});

export const updatePostSchema = z.object({
  name:        z.string().min(1).max(100).optional(),
  age:         z.number().int().min(0).max(50).optional(),
  weight:      z.number().positive().optional(),
  size:        petSizeSchema.optional(),
  category:    petCategorySchema.optional(),
  latitude:    z.number().min(-90).max(90).optional(),
  longitude:   z.number().min(-180).max(180).optional(),
  location:    z.string().min(1).max(200).optional(),
  birthDate:  z.string().datetime().optional(),
  description: z.string().max(1000).optional(),
  photosUrl:   z.array(z.string().url()).optional(),
});

// ─── Search Schema ─────────────────────────────

export const postSearchSchema = z.object({
  q:         z.string().optional(),
  category:  petCategorySchema.optional(),
  size:      petSizeSchema.optional(),
  location:  z.string().optional(),
  latitude:  z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius:    z.coerce.number().positive().optional(),
  page:      z.coerce.number().int().positive().default(1),
  limit:     z.coerce.number().int().positive().max(100).default(20),
});

// ─── Favorite Schema ───────────────────────────

export const createFavoriteSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
});