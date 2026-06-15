// ───────────────────────────────────────────────
//  Validate Request — Zod schema validation middleware
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Express middleware that validates req.body (or req.query) against a Zod schema.
 * If validation fails, responds with 400 and the field errors.
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