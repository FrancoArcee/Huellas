// ───────────────────────────────────────────────
//  Upload Middleware — Multer configuration
// ───────────────────────────────────────────────
//  Con Cloudinary configurado, los archivos se procesan
//  en memoria y se suben a la nube (persistentes). Sin
//  Cloudinary, se guardan en disco local (desarrollo).

import { randomUUID } from "crypto";
import { mkdirSync, unlinkSync } from "fs";
import path from "path";
import multer from "multer";
import { HttpError } from "../errors/HttpError";
import {
  destroyCloudinaryByUrl,
  isCloudinaryEnabled,
  uploadToCloudinary,
} from "../../config/cloudinary";

export const animalUploadDirectory = path.resolve(process.cwd(), "uploads", "animal");
mkdirSync(animalUploadDirectory, { recursive: true });

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/pjpeg": ".jpg",
  "image/png": ".png",
  "image/x-png": ".png",
  "image/webp": ".webp",
};

const storage = isCloudinaryEnabled
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, animalUploadDirectory),
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${extensionByMimeType[file.mimetype] ?? ""}`);
      },
    });

export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 3,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/x-png",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(HttpError.badRequest(
        `Formato de imagen no compatible (${file.mimetype || "desconocido"}). Usá JPEG, PNG o WebP.`,
      ));
    }
  },
});

/**
 * Devuelve las URLs públicas de las fotos recién subidas:
 * Cloudinary si está configurado, o el disco local si no.
 */
export async function persistAnimalPhotos(
  files: Express.Multer.File[],
  baseUrl: string,
): Promise<string[]> {
  if (isCloudinaryEnabled) {
    return Promise.all(files.map((file) => uploadToCloudinary(file.buffer, "animals")));
  }
  return files.map((file) => `${baseUrl}/uploads/animal/${file.filename}`);
}

export function removeAnimalUploads(photoUrls: string[]): void {
  for (const photoUrl of photoUrls) {
    if (photoUrl.includes("res.cloudinary.com")) {
      void destroyCloudinaryByUrl(photoUrl);
      continue;
    }
    try {
      const parsedUrl = new URL(photoUrl, "http://localhost");
      if (!parsedUrl.pathname.startsWith("/uploads/animal/")) continue;

      const filename = path.basename(parsedUrl.pathname);
      unlinkSync(path.join(animalUploadDirectory, filename));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") {
        console.error("Could not remove animal upload", error);
      }
    }
  }
}

// ─── Clinical Documents Upload ──────────────────

export const clinicalUploadDirectory = path.resolve(process.cwd(), "uploads", "clinical");
mkdirSync(clinicalUploadDirectory, { recursive: true });

const clinicalExtensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/pjpeg": ".jpg",
  "image/png": ".png",
  "image/x-png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const clinicalStorage = isCloudinaryEnabled
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, clinicalUploadDirectory),
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${clinicalExtensionByMimeType[file.mimetype] ?? ""}`);
      },
    });

export const clinicalUpload = multer({
  storage: clinicalStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/x-png",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(HttpError.badRequest(
        `Formato de documento no compatible (${file.mimetype || "desconocido"}). Usá JPEG, PNG, WebP o PDF.`,
      ));
    }
  },
});

/**
 * Devuelve las URLs públicas de los documentos clínicos
 * recién subidos (Cloudinary o disco local).
 */
export async function persistClinicalDocuments(
  files: Express.Multer.File[],
  baseUrl: string,
): Promise<string[]> {
  if (isCloudinaryEnabled) {
    return Promise.all(files.map((file) => uploadToCloudinary(file.buffer, "clinical")));
  }
  return files.map((file) => `${baseUrl}/uploads/clinical/${file.filename}`);
}

export function removeClinicalUploads(documentUrls: string[]): void {
  for (const documentUrl of documentUrls) {
    if (documentUrl.includes("res.cloudinary.com")) {
      void destroyCloudinaryByUrl(documentUrl);
      continue;
    }
    try {
      const parsedUrl = new URL(documentUrl, "http://localhost");
      if (!parsedUrl.pathname.startsWith("/uploads/clinical/")) continue;

      const filename = path.basename(parsedUrl.pathname);
      unlinkSync(path.join(clinicalUploadDirectory, filename));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") {
        console.error("Could not remove clinical upload", error);
      }
    }
  }
}
