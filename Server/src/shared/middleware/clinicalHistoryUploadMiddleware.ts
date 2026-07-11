// ───────────────────────────────────────────────
//  Clinical History Upload Middleware — Multer configuration
// ───────────────────────────────────────────────

import { randomUUID } from "crypto";
import { mkdirSync, unlinkSync } from "fs";
import path from "path";
import multer from "multer";
import { HttpError } from "../errors/HttpError";

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

const storage = multer.diskStorage({
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

export function removeClinicalUploads(comprobanteUrls: string[]): void {
  for (const url of comprobanteUrls) {
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
