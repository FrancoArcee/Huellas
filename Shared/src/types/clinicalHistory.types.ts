export enum EventType {
  VACUNACION = "VACUNACION",
  DESPARASITACION = "DESPARASITACION",
  CONSULTA_GENERAL = "CONSULTA_GENERAL",
  CIRUGIA = "CIRUGIA",
  DIAGNOSTICO = "DIAGNOSTICO",
}

export type EventTypeValues = `${EventType}`;

export interface ClinicalHistoryEntry {
  id: string;
  clinicalHistoryId: string;
  date: string;
  eventType: EventTypeValues;
  title: string;
  description: string;
  documentsUrl: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinicalHistoryEntryDTO {
  eventType: EventTypeValues;
  title: string;
  description: string;
  date: string;
  documentsUrl?: string[];
}

export interface UpdateClinicalHistoryEntryDTO {
  eventType?: EventTypeValues;
  title?: string;
  description?: string;
  date?: string;
  documentsUrl?: string[];
}

export interface ClinicalHistory {
  id: string;
  postId: string;
  entries: ClinicalHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
