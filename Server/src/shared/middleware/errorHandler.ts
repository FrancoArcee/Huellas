// ───────────────────────────────────────────────
//  Error Handler — Global error handling middleware
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
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

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}