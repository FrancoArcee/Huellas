// ───────────────────────────────────────────────
//  Clinical History Controller — Express handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import {
  createClinicalHistoryEntrySchema,
  updateClinicalHistoryEntrySchema,
} from "@huellas/shared";
import { sendSuccess } from "../../../shared/utils/response";
import { clinicalHistoryService } from "../service/clinicalHistory.service";

/**
 * GET /animals/:id/clinical-history
 * Retrieve the clinical history of a post (owner only).
 */
export async function getClinicalHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const postId = String(req.params.id);
    const history = await clinicalHistoryService.getClinicalHistoryByPostId(
      postId,
      req.user!.id,
    );
    sendSuccess(res, history);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /clinical-histories/:id/entries
 * Add a new entry to a clinical history (owner only).
 */
export async function createEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createClinicalHistoryEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const clinicalHistoryId = String(req.params.id);
    const entry = await clinicalHistoryService.createEntry(
      clinicalHistoryId,
      parsed.data,
      req.user!.id,
    );

    sendSuccess(res, entry, "Entry created successfully", 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /entries/:id
 * Update an existing clinical history entry (owner only).
 */
export async function updateEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateClinicalHistoryEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const entryId = String(req.params.id);
    const entry = await clinicalHistoryService.updateEntry(
      entryId,
      parsed.data,
      req.user!.id,
    );

    sendSuccess(res, entry, "Entry updated successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /entries/:id
 * Delete a clinical history entry (owner only).
 */
export async function deleteEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entryId = String(req.params.id);
    await clinicalHistoryService.deleteEntry(entryId, req.user!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
