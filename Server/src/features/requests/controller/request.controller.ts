// ───────────────────────────────────────────────
//  Request Controller — Express request handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import { postSearchSchema } from "@huellas/shared";
import { requestService } from "../service/request.service";
import { HttpError } from "../../../shared/errors/HttpError";

// ─── Handlers ──────────────────────────────────

/**
 * GET /requests
 * Advanced search for posts with filters and pagination.
 * Public endpoint (no authentication required).
 */
export async function searchPosts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = postSearchSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      q,
      category,
      size,
      location,
      latitude,
      longitude,
      radius,
      minAge,
      maxAge,
      minWeight,
      maxWeight,
      userId,
      page,
      limit,
    } = parsed.data;

    const result = await requestService.searchPosts(
      {
        q,
        category,
        size,
        location,
        latitude,
        longitude,
        radius,
        minAge,
        maxAge,
        minWeight,
        maxWeight,
        userId,
      },
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}