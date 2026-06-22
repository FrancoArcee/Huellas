// ───────────────────────────────────────────────
//  Validation — Zod schemas compartidos
// ───────────────────────────────────────────────

import { z } from "zod";

// ─── Enums ─────────────────────────────────────

export const contactTypeSchema = z.enum(["WhatsApp", "Telegram", "Instagram", "Discord", "Facebook", "Messenger"]);
export const petSizeSchema     = z.enum(["small", "medium", "large"]);
export const petCategorySchema = z.enum(["dog", "cat", "other"]);

// ─── Contact Validation Helper ────────────────

export function validateContactByType(contact: string, contactType: string): boolean {
  switch (contactType) {
    case "WhatsApp":
      return /^\+?\d{8,15}$/.test(contact);
    case "Telegram":
      return /^@[a-zA-Z0-9_]{5,32}$/.test(contact);
    case "Instagram":
      return /^[a-zA-Z0-9]([a-zA-Z0-9._]*[a-zA-Z0-9])?$/.test(contact) && contact.length <= 30;
    case "Discord":
      return /^[a-zA-Z0-9._]{2,32}$/.test(contact);
    case "Facebook": {
      const usernameRegex = /^[a-zA-Z0-9.]{5,50}$/;
      const urlRegex = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]{5,50}$/;
      return usernameRegex.test(contact) || urlRegex.test(contact);
    }
    case "Messenger":
      return /^[a-zA-Z0-9.]{5,50}$/.test(contact);
    default:
      return false;
  }
}

const contactErrorMessages: Record<string, string> = {
  WhatsApp:  "El contacto de WhatsApp debe ser un número de teléfono válido (8-15 dígitos, puede incluir + al inicio)",
  Telegram:  "El contacto de Telegram debe empezar con @ seguido de 5-32 caracteres alfanuméricos o guiones bajos",
  Instagram: "El contacto de Instagram debe ser un username válido (1-30 caracteres, letras, números, puntos y guiones bajos; no puede empezar con punto ni tener dos puntos seguidos)",
  Discord:   "El contacto de Discord debe ser un username válido (2-32 caracteres, letras, números, puntos y guiones bajos)",
  Facebook:  "El contacto de Facebook debe ser un username válido (5-50 caracteres) o una URL de facebook.com",
  Messenger: "El contacto de Messenger debe ser un username válido (5-50 caracteres, letras y números)",
};

// ─── User Schemas ──────────────────────────────

export const createUserSchema = z.object({
  name:             z.string().min(2).max(80),
  email:            z.string().email(),
  password:         z.string().min(6).max(128),
  contact:          z.string().min(3).max(60),
  contactType:      contactTypeSchema,
  profilePictureUrl: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (!validateContactByType(data.contact, data.contactType)) {
    ctx.addIssue({
      code:    z.ZodIssueCode.custom,
      path:    ["contact"],
      message: contactErrorMessages[data.contactType],
    });
  }
});

export const updateUserSchema = z.object({
  name:             z.string().min(2).max(80).optional(),
  email:            z.string().email().optional(),
  password:         z.string().min(6).max(128).optional(),
  contact:          z.string().min(3).max(60).optional(),
  contactType:      contactTypeSchema.optional(),
  profilePictureUrl: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (data.contact !== undefined && data.contactType !== undefined) {
    if (!validateContactByType(data.contact, data.contactType)) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["contact"],
        message: contactErrorMessages[data.contactType],
      });
    }
  }
});

// ─── Post Schemas ──────────────────────────────

export const createPostSchema = z.object({
  name:       z.string().min(1).max(100),
  age:        z.number().int().min(0).max(50),
  weight:     z.number().positive(),
  size:       petSizeSchema,
  category:   petCategorySchema,
  gender:     z.enum(["male", "female"]),
  neutered:   z.boolean(),
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
  gender:      z.enum(["male", "female"]).optional(),
  neutered:    z.boolean().optional(),
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
  minAge:    z.coerce.number().int().min(0).optional(),
  maxAge:    z.coerce.number().int().min(0).optional(),
  minWeight:  z.coerce.number().positive().optional(),
  maxWeight:  z.coerce.number().positive().optional(),
  userId:    z.string().min(1).max(128).optional(),
  page:      z.coerce.number().int().positive().default(1),
  limit:     z.coerce.number().int().positive().max(100).default(20),
});

// ─── Favorite Schema ───────────────────────────

export const createFavoriteSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
});
