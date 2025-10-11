import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAge(years: number, months: number): string {
  if (years === 0) {
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  if (months === 0) {
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
  return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPhoneForWhatsApp(phone: string | null | undefined): string {
  // Return empty string if phone is null or undefined
  if (!phone) return '';
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

export function generateWhatsAppMessage(dogName: string, dogId: string): string {
  const message = encodeURIComponent(
    `Hola! Estoy interesado en adoptar a ${dogName}. Vi su publicación en Pura Pata.\n\nID: ${dogId}`
  );
  return message;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const costaRicaProvinces = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
];

export const dogSizes = [
  { value: 'pequeño', label: 'Pequeño (< 10kg)' },
  { value: 'mediano', label: 'Mediano (10-25kg)' },
  { value: 'grande', label: 'Grande (> 25kg)' },
];

export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  return file.size <= maxSize;
}

export function validateFileType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(file.type);
}
