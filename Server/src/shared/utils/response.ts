// ───────────────────────────────────────────────
//  Response — Helpers estandarizados para respuestas de API
// ───────────────────────────────────────────────

import type { Response } from "express";

/**
 * Envía una respuesta exitosa con datos.
 */
export function sendSuccess(res: Response, data: unknown, message?: string, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
}

/**
 * Envía una respuesta de error.
 */
export function sendError(res: Response, statusCode: number, code: string, message: string): void {
  res.status(statusCode).json({
    success: false,
    error: code,
    message,
  });
}