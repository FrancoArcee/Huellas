// ───────────────────────────────────────────────
//  Upload Middleware — Multer configuration
// ───────────────────────────────────────────────

import { randomUUID } from "crypto";
import { mkdirSync, unlinkSync } from "fs";
import path from "path";
import multer from "multer";
import { HttpError } from "../errors/HttpError";

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

const storage = multer.diskStorage({
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

export function removeAnimalUploads(photoUrls: string[]): void {
  for (const photoUrl of photoUrls) {
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

const clinicalStorage = multer.diskStorage({
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

export function removeClinicalUploads(documentUrls: string[]): void {
  for (const documentUrl of documentUrls) {
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
