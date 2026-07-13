export const translateCategory = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'dog': return 'Perro';
    case 'cat': return 'Gato';
    case 'other': return 'Otro';
    default: return category || 'Otro';
  }
};

export const translateGender = (gender: string): string => {
  switch (gender?.toLowerCase()) {
    case 'male': return 'Macho';
    case 'female': return 'Hembra';
    default: return gender || 'Macho';
  }
};

export const translateSize = (size: string): string => {
  switch (size?.toLowerCase()) {
    case 'small': return 'Pequeño';
    case 'medium': return 'Mediano';
    case 'large': return 'Grande';
    default: return size || '';
  }
};

export const formatAge = (age: number | undefined): string => {
  if (age === undefined || age === null) return '';
  return `${age} ${age === 1 ? 'año' : 'años'}`;
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

export const translateStatus = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case 'EN_ADOPCION': return 'En adopción';
    case 'EN_TRANSITO': return 'En tránsito';
    case 'ADOPTADO': return 'Adoptado';
    default: return status || 'En adopción';
  }
};
