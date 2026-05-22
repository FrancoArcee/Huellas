type FormData = {
  nombre: string;
  fechaNacimiento: string;
  edad: string;
  tamano: string;
  ubicacion: string;
  peso: string;
  genero: string;
  castrado: string;
  descripcion?: string;
};

type FieldError = string | null;

const DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const NUMERIC_REGEX = /^[0-9]*$/;
const DECIMAL_REGEX = /^[0-9]*\.?[0-9]*$/;

export function sanitizeNumericInput(value: string, allowDecimal = false): string {
  if (allowDecimal) {
    const parts = value.match(DECIMAL_REGEX);
    return parts ? parts[0] : '';
  }
  return value.replace(/\D/g, '');
}

export function validateField(key: string, value: string): FieldError {
  const trimmed = value.trim();

  switch (key) {
    case 'nombre':
      if (!trimmed) return 'El nombre es obligatorio';
      if (trimmed.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return null;

    case 'fechaNacimiento':
      if (!trimmed) return null;
      const match = trimmed.match(DATE_REGEX);
      if (!match) return 'Formato inválido (DD/MM/YYYY)';
      const d = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const y = parseInt(match[3], 10);
      if (m < 1 || m > 12) return 'Mes inválido (1-12)';
      if (d < 1 || d > 31) return 'Día inválido (1-31)';
      if (y < 1900 || y > 2100) return 'Año inválido';
      return null;

    case 'edad':
      if (!trimmed) return 'La edad es obligatoria';
      if (!/^\d+$/.test(trimmed)) return 'Debe ser un número entero';
      const age = parseInt(trimmed, 10);
      if (age < 0) return 'La edad no puede ser negativa';
      if (age > 100) return 'La edad no puede ser mayor a 100 años';
      return null;

    case 'tamano':
      if (!trimmed) return 'El tamaño es obligatorio';
      if (!['Chico', 'Mediano', 'Grande'].includes(trimmed)) return 'Seleccioná un tamaño válido';
      return null;

    case 'ubicacion':
      if (!trimmed) return 'La ubicación es obligatoria';
      if (trimmed.length < 3) return 'La ubicación debe tener al menos 3 caracteres';
      return null;

    case 'peso':
      if (!trimmed) return 'El peso es obligatorio';
      if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'Debe ser un número válido (ej: 12.5)';
      const weight = parseFloat(trimmed);
      if (weight <= 0) return 'El peso debe ser mayor a 0';
      if (weight > 50) return 'El peso no puede ser mayor a 50 kg';
      return null;

    case 'genero':
      if (!trimmed) return 'El género es obligatorio';
      if (!['Macho', 'Hembra'].includes(trimmed)) return 'Seleccioná un género válido';
      return null;

    case 'castrado':
      if (!trimmed) return 'Este campo es obligatorio';
      if (!['Si', 'No'].includes(trimmed)) return 'Seleccioná una opción válida';
      return null;

    case 'descripcion':
      return null;

    default:
      return null;
  }
}

export function validateStep(formData: FormData, step: number): FieldError {
  if (step === 1) {
    for (const field of ['nombre', 'edad', 'tamano'] as const) {
      const error = validateField(field, formData[field]);
      if (error) return error;
    }
    const fechaError = validateField('fechaNacimiento', formData.fechaNacimiento);
    if (fechaError) return fechaError;
    return null;
  }

  if (step === 2) {
    for (const field of ['ubicacion', 'peso', 'genero', 'castrado'] as const) {
      const error = validateField(field, formData[field]);
      if (error) return error;
    }
    return null;
  }

  return null;
}

export function validateAll(formData: FormData): FieldError {
  const step1 = validateStep(formData, 1);
  if (step1) return step1;
  return validateStep(formData, 2);
}