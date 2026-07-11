// ───────────────────────────────────────────────
//  Clinical History Controller — Express handlers
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import { createClinicalHistorySchema, updateClinicalHistorySchema } from "@huellas/shared";
import { clinicalHistoryService } from "../service/clinicalHistory.service";
import { clinicalHistoryRepository } from "../repository/clinicalHistory.repository";
import { removeClinicalUploads } from "../../../shared/middleware/clinicalHistoryUploadMiddleware";

function getFileUrl(req: Request, filename: string): string {
  return `${req.protocol}://${req.get("host")}/uploads/clinical-history/${filename}`;
}

export async function getClinicalHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log("GET getClinicalHistory called with postId:", req.params.postId);
  try {
    const postId = req.params.postId as string;
    if (!postId) {
      res.status(400).json({ success: false, message: "El ID de la publicación es requerido" });
      return;
    }
    const history = await clinicalHistoryService.getPostClinicalHistory(postId);
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

export async function createClinicalHistoryItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const comprobanteUrl = req.file ? getFileUrl(req, req.file.filename) : "";
  try {
    const postId = req.params.postId as string;
    if (!postId) {
      if (req.file) removeClinicalUploads([comprobanteUrl]);
      res.status(400).json({ success: false, message: "El ID de la publicación es requerido" });
      return;
    }

    const parsed = createClinicalHistorySchema.safeParse({
      ...req.body,
      comprobante: comprobanteUrl,
    });

    if (!parsed.success) {
      if (req.file) removeClinicalUploads([comprobanteUrl]);
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
    if (req.file) removeClinicalUploads([comprobanteUrl]);
    next(error);
  }
}

export async function updateClinicalHistoryItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const newComprobanteUrl = req.file ? getFileUrl(req, req.file.filename) : undefined;
  try {
    const itemId = req.params.itemId as string;
    if (!itemId) {
      if (req.file) removeClinicalUploads([newComprobanteUrl!]);
      res.status(400).json({ success: false, message: "El ID del ítem es requerido" });
      return;
    }

    const payload: any = { ...req.body };
    if (newComprobanteUrl) {
      payload.comprobante = newComprobanteUrl;
    }

    const parsed = updateClinicalHistorySchema.safeParse(payload);

    if (!parsed.success) {
      if (req.file) removeClinicalUploads([newComprobanteUrl!]);
      res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.user!.id;
    
    // Obtenemos el comprobante anterior antes de actualizar para poder borrarlo si se sube uno nuevo
    const existingItem = await clinicalHistoryRepository.findById(itemId);
    const oldComprobante = existingItem?.comprobante;

    const itemToUpdate = await clinicalHistoryService.updateItem(itemId, parsed.data, userId);

    if (newComprobanteUrl && oldComprobante && oldComprobante !== newComprobanteUrl) {
      removeClinicalUploads([oldComprobante]);
    }

    res.status(200).json({
      success: true,
      data: itemToUpdate,
      message: "Registro del historial clínico actualizado con éxito",
    });
  } catch (error) {
    if (req.file) removeClinicalUploads([newComprobanteUrl!]);
    next(error);
  }
}

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
      removeClinicalUploads([deletedItem.comprobante]);
    }

    res.status(200).json({
      success: true,
      message: "Registro del historial clínico eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
}
