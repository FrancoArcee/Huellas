// ───────────────────────────────────────────────
//  Error Handler — Global error handling middleware
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { HttpError } from "../errors/HttpError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "Cada imagen puede pesar como máximo 3 MB."
      : err.code === "LIMIT_FILE_COUNT"
        ? "Podés adjuntar hasta 3 imágenes."
        : "No se pudieron procesar las imágenes adjuntas.";
    res.status(400).json({
      success: false,
      error: err.code,
      message,
    });
    return;
  }

  if (err.name === "PostNotFoundError" || err.name === "UserNotFoundError") {
    res.status(404).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === "ForbiddenError") {
    res.status(403).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === "ContactAlreadyInUseError") {
    res.status(409).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
