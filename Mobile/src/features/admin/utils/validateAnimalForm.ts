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

function calculateAgeInMonths(birthDate: Date, today = new Date()): number {
  const yearsDiff = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthsDiff = today.getUTCMonth() - birthDate.getUTCMonth();
  const daysDiff = today.getUTCDate() - birthDate.getUTCDate();
  
  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff < 0) {
    totalMonths--;
  }
  return totalMonths >= 0 ? totalMonths : 0;
}

function validateBirthDateAgeConsistency(
  birthDateValue: string,
  ageValue: string,
  unidadTiempo = 'años',
): string | undefined {
  if (!birthDateValue || !ageValue) return undefined;

  const birthDate = parseBirthDate(birthDateValue);
  if (!birthDate) return undefined;

  const enteredAge = Number(ageValue);
  if (Number.isNaN(enteredAge)) return undefined;

  if (unidadTiempo === 'meses') {
    const expectedAge = calculateAgeInMonths(birthDate);
    return enteredAge === expectedAge
      ? undefined
      : `La edad debe coincidir con la fecha de nacimiento (${expectedAge} ${expectedAge === 1 ? 'mes' : 'meses'})`;
  } else {
    const expectedAge = calculateAge(birthDate);
    return enteredAge === expectedAge
      ? undefined
      : `La edad debe coincidir con la fecha de nacimiento (${expectedAge} ${expectedAge === 1 ? 'año' : 'años'})`;
  }
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
  unidadTiempo: z.string().min(1, 'La unidad de tiempo es obligatoria'),
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
  estado: z.string().min(1, 'El estado es obligatorio'),
  descripcion: z
    .string()
    .max(255, 'La descripción no puede superar los 255 caracteres'),
    });

export const animalFormSchema = baseAnimalFormSchema.superRefine((data, ctx) => {
  const consistencyError = validateBirthDateAgeConsistency(data.fechaNacimiento, data.edad, data.unidadTiempo);
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
      mimeType: z.string().nullable().optional(),
    }).passthrough(),
  )
  .max(3, 'Podés adjuntar hasta 3 fotos')
  .refine(
    (photos) => photos.every((photo) => !photo.fileSize || photo.fileSize <= 3 * 1024 * 1024),
    'Cada foto debe pesar como máximo 3 MB',
  )
  .refine(
    (photos) => photos.every((photo) =>
      !photo.mimeType ||
      ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/webp']
        .includes(photo.mimeType.toLowerCase()),
    ),
    'Usá imágenes JPEG, PNG o WebP',
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
    const consistencyError = validateBirthDateAgeConsistency(
      formData.fechaNacimiento,
      formData.edad,
      formData.unidadTiempo
    );
    if (consistencyError) errors.edad = consistencyError;
    return errors;
  }
  if (step === 2) {
    return validateFields(formData, ['ubicacion', 'peso', 'genero', 'castrado', 'estado']);
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
