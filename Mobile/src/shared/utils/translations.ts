export const translateCategory = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'dog': return 'Perro';
    case 'cat': return 'Gato';
    case 'bird': return 'Ave';
    case 'rabbit': return 'Conejo';
    case 'hamster': return 'Hamster';
    case 'fish': return 'Pez';
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

export const getStatusColors = (status?: string): { bg: string; color: string } => {
  const norm = status?.toUpperCase().replace(' ', '_');
  switch (norm) {
    case 'ADOPTADO':
      return { bg: '#FED1D1', color: '#FF0707' };
    case 'EN_TRANSITO':
    case 'EN_TRÁNSITO':
      return { bg: '#FDD9A8', color: '#FB7005' };
    case 'EN_ADOPCION':
    case 'EN_ADOPCIÓN':
      return { bg: '#B5F3BF', color: '#007A14' };
    default:
      return { bg: '#B5F3BF', color: '#007A14' };
  }
};
