import { z } from 'zod';

const dateSchema = z.string().superRefine((value, ctx) => {
  if (!value) return;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    ctx.addIssue({ code: 'custom', message: 'Formato inválido (DD/MM/YYYY)' });
    return;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValid) {
    ctx.addIssue({ code: 'custom', message: 'La fecha no es válida' });
  } else if (date > new Date()) {
    ctx.addIssue({ code: 'custom', message: 'La fecha no puede ser futura' });
  }
});

export const animalFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  fechaNacimiento: dateSchema,
  edad: z
    .string()
    .min(1, 'La edad es obligatoria')
    .regex(/^\d+$/, 'Debe ser un número entero')
    .refine((value) => Number(value) <= 50, 'La edad no puede ser mayor a 50 años'),
  tamano: z.enum(['Chico', 'Mediano', 'Grande'], {
    message: 'Seleccioná un tamaño válido',
  }),
  ubicacion: z
    .string()
    .trim()
    .min(1, 'La ubicación es obligatoria')
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(200, 'La ubicación no puede superar los 200 caracteres'),
  peso: z
    .string()
    .min(1, 'El peso es obligatorio')
    .regex(/^\d+(\.\d+)?$/, 'Debe ser un número válido (ej: 12.5)')
    .refine((value) => Number(value) > 0, 'El peso debe ser mayor a 0')
    .refine((value) => Number(value) <= 200, 'El peso no puede ser mayor a 200 kg'),
  genero: z.enum(['Macho', 'Hembra'], {
    message: 'Seleccioná un género válido',
  }),
  castrado: z.enum(['Si', 'No'], {
    message: 'Seleccioná una opción válida',
  }),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede superar los 1000 caracteres'),
});

export const animalPhotosSchema = z
  .array(
    z.object({
      fileSize: z.number().optional(),
    }).passthrough(),
  )
  .max(3, 'Podés adjuntar hasta 3 fotos')
  .refine(
    (photos) => photos.every((photo) => !photo.fileSize || photo.fileSize <= 3 * 1024 * 1024),
    'Cada foto debe pesar como máximo 3 MB',
  );

export type AnimalFormData = z.infer<typeof animalFormSchema>;
export type AnimalFormField = keyof AnimalFormData;
export type AnimalFormErrors = Partial<Record<AnimalFormField | 'imagenes', string | undefined>>;
export type AnimalFormValues = Record<AnimalFormField, string>;

export function sanitizeNumericInput(value: string, allowDecimal = false): string {
  if (!allowDecimal) return value.replace(/\D/g, '');
  const normalized = value.replace(',', '.');
  return /^\d*\.?\d*$/.test(normalized) ? normalized : '';
}

export function validateField(
  key: AnimalFormField,
  value: string,
): string | undefined {
  const result = animalFormSchema.shape[key].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export function validateFields(
  formData: AnimalFormValues,
  fields: AnimalFormField[],
): AnimalFormErrors {
  const errors: AnimalFormErrors = {};
  for (const field of fields) {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function validateStep(
  formData: AnimalFormValues,
  step: number,
): AnimalFormErrors {
  if (step === 1) {
    return validateFields(formData, ['nombre', 'fechaNacimiento', 'edad', 'tamano']);
  }
  if (step === 2) {
    return validateFields(formData, ['ubicacion', 'peso', 'genero', 'castrado']);
  }
  return validateFields(formData, ['descripcion']);
}

export function validateAll(formData: AnimalFormValues): AnimalFormErrors {
  const result = animalFormSchema.safeParse(formData);
  if (result.success) return {};

  const errors: AnimalFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as AnimalFormField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
