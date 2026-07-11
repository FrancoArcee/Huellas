// ───────────────────────────────────────────────
//  Clinical History Service — API calls to backend
// ───────────────────────────────────────────────

import type { ImagePickerAsset } from 'expo-image-picker';
import { api } from '../../../shared/services/api';
import type { ClinicalHistoryItem } from '@huellas/shared';

export interface ClinicalHistoryPayload {
  type: string;
  name: string;
  date: string;
  veterinary: string;
  veterinarian: string;
  description?: string | undefined;
}

function appendAsset(form: FormData, asset: ImagePickerAsset): void {
  if (asset.file) {
    form.append('comprobante', asset.file);
    return;
  }

  form.append('comprobante', {
    uri: asset.uri,
    name: asset.fileName ?? `comprobante-${Date.now()}.jpg`,
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);
}

function buildFormData(
  payload: ClinicalHistoryPayload,
  comprobante: ImagePickerAsset | string,
): FormData {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, String(value));
    }
  });

  if (typeof comprobante === 'string') {
    form.append('comprobante', comprobante);
  } else {
    appendAsset(form, comprobante);
  }

  return form;
}

const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

export const clinicalHistoryService = {
  async listByPost(postId: string): Promise<ClinicalHistoryItem[]> {
    const response = await api.get(`/animals/${postId}/clinical-history`);
    return response.data.data;
  },

  async create(
    postId: string,
    payload: ClinicalHistoryPayload,
    comprobante: ImagePickerAsset,
  ): Promise<ClinicalHistoryItem> {
    const response = await api.post(
      `/animals/${postId}/clinical-history`,
      buildFormData(payload, comprobante),
      multipartConfig,
    );
    return response.data.data;
  },

  async update(
    postId: string,
    itemId: string,
    payload: ClinicalHistoryPayload,
    comprobante: ImagePickerAsset | string,
  ): Promise<ClinicalHistoryItem> {
    const response = await api.put(
      `/animals/${postId}/clinical-history/${itemId}`,
      buildFormData(payload, comprobante),
      multipartConfig,
    );
    return response.data.data;
  },

  async remove(postId: string, itemId: string): Promise<void> {
    await api.delete(`/animals/${postId}/clinical-history/${itemId}`);
  },
};
