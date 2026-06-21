import { z } from 'zod';
import { contactTypeSchema, validateContactByType } from '@huellas/shared';

const contactErrorMessages: Record<string, string> = {
  WhatsApp: "El contacto de WhatsApp debe ser un número de teléfono válido (8-15 dígitos, puede incluir + al inicio)",
  Telegram: "El contacto de Telegram debe empezar con @ seguido de 5-32 caracteres alfanuméricos o guiones bajos",
  Instagram: "El contacto de Instagram debe ser un username válido (1-30 caracteres, letras, números, puntos y guiones bajos)",
  Discord: "El contacto de Discord debe ser un username válido (2-32 caracteres, letras, números, puntos y guiones bajos)",
  Facebook: "El contacto de Facebook debe ser un username válido (5-50 caracteres, letras y números, guiones bajos)",
  Messenger: "El contacto de Messenger debe ser un username válido (5-50 caracteres, letras y números)",
};

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre completo es obligatorio')
    .min(2, 'El nombre completo debe tener al menos 2 caracteres')
    .max(80, 'El nombre completo no puede superar los 80 caracteres'),
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(128, 'La contraseña no puede superar los 128 caracteres'),
  contactType: contactTypeSchema,
  contact: z
    .string()
    .min(1, 'El contacto es obligatorio')
    .min(3, 'El contacto debe tener al menos 3 caracteres')
    .max(60, 'El contacto no puede superar los 60 caracteres'),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones para continuar.',
    }),
}).superRefine((data, ctx) => {
  if (!validateContactByType(data.contact, data.contactType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contact"],
      message: contactErrorMessages[data.contactType] || "Contacto no válido",
    });
  }
});
