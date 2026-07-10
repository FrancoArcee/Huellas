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
import { removeClinicalUploads } from "../../../shared/middleware/uploadMiddleware";

function uploadedDocumentUrls(req: Request): string[] {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  return files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/clinical/${file.filename}`,
  );
}

function parseExistingDocuments(req: Request): string[] {
  const raw = req.body.existingDocumentsUrl;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((u) => typeof u === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

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
  const newDocuments = uploadedDocumentUrls(req);
  try {
    const parsed = createClinicalHistoryEntrySchema.safeParse({
      ...req.body,
      documentsUrl: newDocuments,
    });
    if (!parsed.success) {
      removeClinicalUploads(newDocuments);
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
    removeClinicalUploads(newDocuments);
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
  const newDocuments = uploadedDocumentUrls(req);
  try {
    const retainedDocuments = parseExistingDocuments(req);
    const allDocuments = [...retainedDocuments, ...newDocuments];

    const parsed = updateClinicalHistoryEntrySchema.safeParse({
      ...req.body,
      documentsUrl: allDocuments.length > 0 ? allDocuments : undefined,
    });
    if (!parsed.success) {
      removeClinicalUploads(newDocuments);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const entryId = String(req.params.id);

    const existingEntry = await clinicalHistoryService.getEntryById(entryId);
    const previousDocuments = existingEntry?.documentsUrl ?? [];
    const removedDocuments = previousDocuments.filter(
      (url) => !retainedDocuments.includes(url),
    );

    const entry = await clinicalHistoryService.updateEntry(
      entryId,
      parsed.data,
      req.user!.id,
    );

    removeClinicalUploads(removedDocuments);
    sendSuccess(res, entry, "Entry updated successfully");
  } catch (error) {
    removeClinicalUploads(newDocuments);
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

    const existingEntry = await clinicalHistoryService.getEntryById(entryId);
    const documentsToDelete = existingEntry?.documentsUrl ?? [];

    await clinicalHistoryService.deleteEntry(entryId, req.user!.id);
    removeClinicalUploads(documentsToDelete);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
