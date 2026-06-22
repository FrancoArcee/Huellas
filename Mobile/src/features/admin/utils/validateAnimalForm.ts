import { z } from 'zod';

function parseBirthDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isValid ? date : null;
}

function calculateAge(birthDate: Date, today = new Date()): number {
  const hadBirthdayThisYear =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (
      today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() >= birthDate.getUTCDate()
    );

  return today.getUTCFullYear() - birthDate.getUTCFullYear() - (hadBirthdayThisYear ? 0 : 1);
}

function validateBirthDateAgeConsistency(
  birthDateValue: string,
  ageValue: string,
): string | undefined {
  if (!birthDateValue || !ageValue) return undefined;

  const birthDate = parseBirthDate(birthDateValue);
  if (!birthDate) return undefined;

  const enteredAge = Number(ageValue);
  if (Number.isNaN(enteredAge)) return undefined;

  const expectedAge = calculateAge(birthDate);
  return enteredAge === expectedAge
    ? undefined
    : `La edad debe coincidir con la fecha de nacimiento (${expectedAge} anios)`;
}

const dateSchema = z.string().superRefine((value, ctx) => {
  if (!value) return;
  const date = parseBirthDate(value);

  if (!date) {
    ctx.addIssue({ code: 'custom', message: 'La fecha no es valida' });
  } else if (date > new Date()) {
    ctx.addIssue({ code: 'custom', message: 'La fecha no puede ser futura' });
  } else if (calculateAge(date) > 50) {
    ctx.addIssue({ code: 'custom', message: 'La fecha no coincide con la edad maxima permitida' });
  }
});

const baseAnimalFormSchema = z.object({
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
    .regex(/^\d+$/, 'Debe ser un numero entero')
    .refine((value) => Number(value) <= 50, 'La edad no puede ser mayor a 50 anios'),
  tamano: z.enum(['Chico', 'Mediano', 'Grande'], {
    message: 'Selecciona un tamanio valido',
  }),
  ubicacion: z
    .string()
    .trim()
    .min(1, 'La ubicacion es obligatoria')
    .min(3, 'La ubicacion debe tener al menos 3 caracteres')
    .max(200, 'La ubicacion no puede superar los 200 caracteres'),
  peso: z
    .string()
    .min(1, 'El peso es obligatorio')
    .regex(/^\d+(\.\d+)?$/, 'Debe ser un numero valido (ej: 12.5)')
    .refine((value) => Number(value) > 0, 'El peso debe ser mayor a 0')
    .refine((value) => Number(value) <= 200, 'El peso no puede ser mayor a 200 kg'),
  genero: z.enum(['Macho', 'Hembra'], {
    message: 'Selecciona un genero valido',
  }),
  castrado: z.enum(['Si', 'No'], {
    message: 'Selecciona una opcion valida',
  }),
  descripcion: z
    .string()
    .max(1000, 'La descripcion no puede superar los 1000 caracteres'),
});

export const animalFormSchema = baseAnimalFormSchema.superRefine((data, ctx) => {
  const consistencyError = validateBirthDateAgeConsistency(data.fechaNacimiento, data.edad);
  if (consistencyError) {
    ctx.addIssue({
      code: 'custom',
      path: ['edad'],
      message: consistencyError,
    });
  }
});

export const animalPhotosSchema = z
  .array(
    z.object({
      fileSize: z.number().optional(),
    }).passthrough(),
  )
  .max(3, 'Podes adjuntar hasta 3 fotos')
  .refine(
    (photos) => photos.every((photo) => !photo.fileSize || photo.fileSize <= 3 * 1024 * 1024),
    'Cada foto debe pesar como maximo 3 MB',
  );

export type AnimalFormData = z.infer<typeof baseAnimalFormSchema>;
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
  const result = baseAnimalFormSchema.shape[key].safeParse(value);
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
    const errors = validateFields(formData, ['nombre', 'fechaNacimiento', 'edad', 'tamano']);
    const consistencyError = validateBirthDateAgeConsistency(formData.fechaNacimiento, formData.edad);
    if (consistencyError) errors.edad = consistencyError;
    return errors;
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
