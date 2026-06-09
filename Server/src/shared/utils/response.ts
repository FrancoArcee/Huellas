// ───────────────────────────────────────────────
//  Response — Standardized API response helpers
// ───────────────────────────────────────────────

import type { Response } from "express";

/**
 * Send a success response with data.
 */
export function sendSuccess(res: Response, data: unknown, message?: string, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
}

/**
 * Send an error response.
 */
export function sendError(res: Response, statusCode: number, code: string, message: string): void {
  res.status(statusCode).json({
    success: false,
    error: code,
    message,
  });
}