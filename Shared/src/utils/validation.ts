// ───────────────────────────────────────────────
//  Validation — Zod schemas compartidos
// ───────────────────────────────────────────────

import { z } from "zod";

// ─── Enums ─────────────────────────────────────

export const contactTypeSchema = z.enum(["WhatsApp", "Telegram", "Instagram", "Discord", "Facebook", "Messenger"]);
export const petSizeSchema = z.enum(["small", "medium", "large"]);
export const petCategorySchema = z.enum(["dog", "cat", "other"]);

// ─── Contact Validation Helper ────────────────

export function validateContactByType(contact: string, contactType: string): boolean {
  switch (contactType) {
    case "WhatsApp": {
      const clean = contact.replace(/[\s\-()]/g, "");
      return /^\+?\d{8,15}$/.test(clean);
    }
    case "Telegram":
      return /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact);
    case "Instagram": {
      const len = contact.length;
      const isFormatValid = /^[a-zA-Z0-9._]+$/.test(contact) && !contact.includes("..") && !contact.startsWith(".") && !contact.endsWith(".");
      return len >= 1 && len <= 30 && isFormatValid;
    }
    case "Discord": {
      const isNewUsername = /^[a-zA-Z0-9._]{2,32}$/.test(contact) && !contact.includes("..");
      const isLegacyUsername = /^[^#@:]{2,32}#\d{4}$/.test(contact);
      return isNewUsername || isLegacyUsername;
    }
    case "Facebook": {
      let fbUser = contact;
      if (contact.includes("facebook.com/")) {
        fbUser = contact.split("facebook.com/")[1] || "";
        if (fbUser.endsWith("/")) {
          fbUser = fbUser.slice(0, -1);
        }
      }
      return /^[a-zA-Z0-9.]{5,50}$/.test(fbUser) && !fbUser.startsWith(".") && !fbUser.endsWith(".") && !fbUser.includes("..");
    }
    case "Messenger": {
      let msgUser = contact;
      if (contact.includes("m.me/")) {
        msgUser = contact.split("m.me/")[1] || "";
      } else if (contact.includes("messenger.com/t/")) {
        msgUser = contact.split("messenger.com/t/")[1] || "";
      }
      if (msgUser.endsWith("/")) {
        msgUser = msgUser.slice(0, -1);
      }
      return /^[a-zA-Z0-9.]{5,50}$/.test(msgUser) && !msgUser.startsWith(".") && !msgUser.endsWith(".") && !msgUser.includes("..");
    }
    default:
      return false;
  }
}

export const contactErrorMessages: Record<string, string> = {
  WhatsApp: "El contacto de WhatsApp debe ser un número de teléfono válido (8-15 dígitos, puede incluir + al inicio)",
  Telegram: "El contacto de Telegram debe empezar con @ seguido de un username válido de 5-32 caracteres (comenzando con una letra)",
  Instagram: "El contacto de Instagram debe ser un username válido (1-30 caracteres, letras, números, puntos y guiones bajos; no puede empezar/terminar con punto ni tener dos puntos seguidos)",
  Discord: "El contacto de Discord debe ser un username válido (2-32 caracteres, letras, números, puntos y guiones bajos; sin puntos consecutivos o formato legacy usuario#1234)",
  Facebook: "El contacto de Facebook debe ser un username válido (5-50 caracteres, sin guiones bajos) o una URL de facebook.com",
  Messenger: "El contacto de Messenger debe ser un username válido (5-50 caracteres) o una URL de m.me / messenger.com",
};

// ─── User Schemas ──────────────────────────────

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  contact: z.string().min(3).max(60),
  contactType: contactTypeSchema,
  profilePictureUrl: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (!validateContactByType(data.contact, data.contactType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contact"],
      message: contactErrorMessages[data.contactType],
    });
  }
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(128).optional(),
  contact: z.string().min(3).max(60).optional(),
  contactType: contactTypeSchema.optional(),
  profilePictureUrl: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (data.contact !== undefined && data.contactType !== undefined) {
    if (!validateContactByType(data.contact, data.contactType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contact"],
        message: contactErrorMessages[data.contactType],
      });
    }
  }
});

// ─── Post Schemas ──────────────────────────────

function calculateAgeFromBirthDate(value: string, today = new Date()): number | null {
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return null;

  const hadBirthdayThisYear =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (
      today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() >= birthDate.getUTCDate()
    );

  return today.getUTCFullYear() - birthDate.getUTCFullYear() - (hadBirthdayThisYear ? 0 : 1);
}

function validateBirthDateAndAge(
  data: { age?: number; birthDate?: string },
  ctx: z.RefinementCtx,
): void {
  if (!data.birthDate) return;

  const birthDate = new Date(data.birthDate);
  if (birthDate > new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["birthDate"],
      message: "El campo birthDate no puede ser una fecha futura",
    });
    return;
  }

  const expectedAge = calculateAgeFromBirthDate(data.birthDate);
  if (expectedAge === null) return;

  if (expectedAge > 50) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["birthDate"],
      message: "El campo birthDate no puede ser una fecha futura",
    });
  }

  if (data.age !== undefined && data.age !== expectedAge) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["age"],
      message: `El campo age debe ser consistente con birthDate (debería ser ${expectedAge} años)`,
    });
  }
}


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
  placeId:    z.string().min(1).max(500).optional(),
  birthDate:  z.string().datetime().optional(),
  description: z.string().max(255, "La descripción no puede superar los 255 caracteres").optional(),
  photosUrl:  z.array(z.string().url()).optional(),
  }).superRefine((data, ctx) => {
  validateBirthDateAndAge(data, ctx);
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
  placeId:     z.string().min(1).max(500).optional(),
  birthDate:  z.string().datetime().optional(),
  description: z.string().max(255, "La descripción no puede superar los 255 caracteres").optional(),
  photosUrl:   z.array(z.string().url()).optional(),
  }).superRefine((data, ctx) => {
  validateBirthDateAndAge(data, ctx);
});

// ─── Search Schema ─────────────────────────────

export const postSearchSchema = z.object({
  q: z.string().optional(),
  category: petCategorySchema.optional(),
  size: petSizeSchema.optional(),
  location: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().optional(),
  minAge: z.coerce.number().int().min(0).optional(),
  maxAge: z.coerce.number().int().min(0).optional(),
  minWeight: z.coerce.number().positive().optional(),
  maxWeight: z.coerce.number().positive().optional(),
  userId: z.string().min(1).max(128).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Favorite Schema ───────────────────────────

export const createFavoriteSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
});

// ─── Clinical History Schemas ──────────────────

export const eventTypeSchema = z.enum([
  "VACUNACION",
  "DESPARASITACION",
  "CONSULTA_GENERAL",
  "CIRUGIA",
  "DIAGNOSTICO",
]);

export const createClinicalHistoryEntrySchema = z.object({
  eventType: eventTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  date: z.string().datetime(),
  documentUrl: z.string().url().optional(),
});

export const updateClinicalHistoryEntrySchema = z.object({
  eventType: eventTypeSchema.optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  date: z.string().datetime().optional(),
  documentUrl: z.string().url().optional(),
});
