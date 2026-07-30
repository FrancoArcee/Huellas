// ───────────────────────────────────────────────
//  Validate Request — Middleware de validación de esquemas Zod
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Middleware de Express que valida req.body (o req.query) contra un esquema Zod.
 * Si la validación falla, responde con 400 y los errores de campo.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}