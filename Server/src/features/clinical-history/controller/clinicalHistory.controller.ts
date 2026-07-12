// ───────────────────────────────────────────────
//  Clinical History Controller — Express handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import {
  createClinicalHistorySchema,
  updateClinicalHistorySchema,
  createClinicalHistoryEntrySchema,
  updateClinicalHistoryEntrySchema,
} from "@huellas/shared";
import prisma from "../../../config/database";
import { sendSuccess } from "../../../shared/utils/response";
import { clinicalHistoryService } from "../service/clinicalHistory.service";
import { removeClinicalUploads as removeLocalClinicalUploads } from "../../../shared/middleware/clinicalHistoryUploadMiddleware";
import { removeClinicalUploads as removeRemoteClinicalUploads } from "../../../shared/middleware/uploadMiddleware";

function getFileUrl(req: Request, filename: string): string {
  return `${req.protocol}://${req.get("host")}/uploads/clinical-history/${filename}`;
}

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
 * Retrieve the clinical history of a post (any authenticated user).
 */
export async function getClinicalHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const postId = String(req.params.id || req.params.postId);
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
 * POST /animals/:postId/clinical-history
 * Create a new clinical history item for a post (local mobile compatible).
 */
export async function createClinicalHistoryItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const comprobanteUrl = req.file ? getFileUrl(req, req.file.filename) : "";
  try {
    const postId = req.params.postId as string;
    if (!postId) {
      if (req.file) removeLocalClinicalUploads([comprobanteUrl]);
      res.status(400).json({ success: false, message: "El ID de la publicación es requerido" });
      return;
    }

    const parsed = createClinicalHistorySchema.safeParse({
      ...req.body,
      comprobante: comprobanteUrl,
    });

    if (!parsed.success) {
      if (req.file) removeLocalClinicalUploads([comprobanteUrl]);
      res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.user!.id;
    const item = await clinicalHistoryService.createItem(postId, parsed.data, userId);

    res.status(201).json({
      success: true,
      data: item,
      message: "Registro del historial clínico creado con éxito",
    });
  } catch (error) {
    if (req.file) removeLocalClinicalUploads([comprobanteUrl]);
    next(error);
  }
}

/**
 * PUT /animals/:postId/clinical-history/:itemId
 * Update a clinical history item (local mobile compatible).
 */
export async function updateClinicalHistoryItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const newComprobanteUrl = req.file ? getFileUrl(req, req.file.filename) : undefined;
  try {
    const itemId = req.params.itemId as string;
    if (!itemId) {
      if (req.file) removeLocalClinicalUploads([newComprobanteUrl!]);
      res.status(400).json({ success: false, message: "El ID del ítem es requerido" });
      return;
    }

    const payload: any = { ...req.body };
    if (newComprobanteUrl) {
      payload.comprobante = newComprobanteUrl;
    }

    const parsed = updateClinicalHistorySchema.safeParse(payload);

    if (!parsed.success) {
      if (req.file) removeLocalClinicalUploads([newComprobanteUrl!]);
      res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.user!.id;
    
    // Obtenemos el comprobante anterior antes de actualizar para poder borrarlo si se sube uno nuevo
    const existingItem = await prisma.clinicalHistoryEntry.findUnique({
      where: { id: itemId },
    });
    const oldComprobante = existingItem?.documentsUrl?.[0];

    const itemToUpdate = await clinicalHistoryService.updateItem(itemId, parsed.data, userId);

    if (newComprobanteUrl && oldComprobante && oldComprobante !== newComprobanteUrl) {
      removeLocalClinicalUploads([oldComprobante]);
    }

    res.status(200).json({
      success: true,
      data: itemToUpdate,
      message: "Registro del historial clínico actualizado con éxito",
    });
  } catch (error) {
    if (req.file) removeLocalClinicalUploads([newComprobanteUrl!]);
    next(error);
  }
}

/**
 * DELETE /animals/:postId/clinical-history/:itemId
 * Delete a clinical history item (local mobile compatible).
 */
export async function deleteClinicalHistoryItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const itemId = req.params.itemId as string;
    if (!itemId) {
      res.status(400).json({ success: false, message: "El ID del ítem es requerido" });
      return;
    }

    const userId = req.user!.id;
    const deletedItem = await clinicalHistoryService.deleteItem(itemId, userId);

    if (deletedItem.comprobante) {
      removeLocalClinicalUploads([deletedItem.comprobante]);
    }

    res.status(200).json({
      success: true,
      message: "Registro del historial clínico eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /clinical-histories/:id/entries
 * Add a new entry to a clinical history (owner only - remote main compatible).
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
      removeRemoteClinicalUploads(newDocuments);
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
    removeRemoteClinicalUploads(newDocuments);
    next(error);
  }
}

/**
 * PUT /entries/:id
 * Update an existing clinical history entry (owner only - remote main compatible).
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
      removeRemoteClinicalUploads(newDocuments);
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

    removeRemoteClinicalUploads(removedDocuments);
    sendSuccess(res, entry, "Entry updated successfully");
  } catch (error) {
    removeRemoteClinicalUploads(newDocuments);
    next(error);
  }
}

/**
 * DELETE /entries/:id
 * Delete a clinical history entry (owner only - remote main compatible).
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
    removeRemoteClinicalUploads(documentsToDelete);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
