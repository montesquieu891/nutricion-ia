/**
 * Utility functions for the frontend
 */

/**
 * Format calories to display string
 */
export const formatCalorias = (calorias: number): string => {
  return `${calorias} kcal`;
};

/**
 * Format time in minutes to readable string
 */
export const formatTiempo = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
};

/**
 * Validate required fields
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};
