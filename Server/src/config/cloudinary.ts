// ───────────────────────────────────────────────
//  Cloudinary — Almacenamiento persistente de archivos
// ───────────────────────────────────────────────
//  Si las 3 variables de entorno están presentes, los
//  uploads van a Cloudinary (persisten entre deploys y
//  restarts). Si faltan, el servidor sigue usando el
//  disco local (comportamiento de desarrollo).

import { v2 as cloudinary } from "cloudinary";

export const isCloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

if (isCloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Sube un buffer a Cloudinary dentro de huellas/<folder>
 * y devuelve la secure_url pública.
 */
export function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `huellas/${folder}`, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary no devolvió resultado"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

/**
 * Borra un archivo de Cloudinary a partir de su secure_url.
 * Best-effort: los errores solo se loguean.
 */
export async function destroyCloudinaryByUrl(url: string): Promise<void> {
  if (!isCloudinaryEnabled || !url.includes("res.cloudinary.com")) return;
  try {
    const pathname = new URL(url).pathname;
    const match = /\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i.exec(pathname);
    if (!match) return;
    await cloudinary.uploader.destroy(match[1]!, { resource_type: "image" });
  } catch (error) {
    console.error("No se pudo borrar el archivo de Cloudinary", error);
  }
}
