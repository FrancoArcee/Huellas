// ───────────────────────────────────────────────
//  Clinical History Upload Middleware — Multer configuration
// ───────────────────────────────────────────────
//  Con Cloudinary configurado, el comprobante se procesa
//  en memoria y se sube a la nube (persistente). Sin
//  Cloudinary, se guarda en disco local (desarrollo).

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

export const clinicalHistoryUploadDirectory = path.resolve(process.cwd(), "uploads", "clinical-history");
mkdirSync(clinicalHistoryUploadDirectory, { recursive: true });

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/pjpeg": ".jpg",
  "image/png": ".png",
  "image/x-png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const storage = isCloudinaryEnabled
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, clinicalHistoryUploadDirectory),
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${extensionByMimeType[file.mimetype] ?? ""}`);
      },
    });

export const uploadClinical = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
    files: 1, // Max 1 file
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
        `Formato no compatible (${file.mimetype || "desconocido"}). Usá JPEG, PNG, WebP o PDF.`,
      ));
    }
  },
});

/**
 * Devuelve la URL pública del comprobante recién subido
 * (Cloudinary o disco local).
 */
export async function persistClinicalHistoryDocument(
  file: Express.Multer.File,
  baseUrl: string,
): Promise<string> {
  if (isCloudinaryEnabled) {
    return uploadToCloudinary(file.buffer, "clinical-history");
  }
  return `${baseUrl}/uploads/clinical-history/${file.filename}`;
}

export function removeClinicalUploads(comprobanteUrls: string[]): void {
  for (const url of comprobanteUrls) {
    if (url.includes("res.cloudinary.com")) {
      void destroyCloudinaryByUrl(url);
      continue;
    }
    try {
      const parsedUrl = new URL(url, "http://localhost");
      if (!parsedUrl.pathname.startsWith("/uploads/clinical-history/")) continue;

      const filename = path.basename(parsedUrl.pathname);
      unlinkSync(path.join(clinicalHistoryUploadDirectory, filename));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") {
        console.error("Could not remove clinical history upload", error);
      }
    }
  }
}
