// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD', // <-- CAMBIO: De EUR a USD para coincidir con la base de datos
  }).format(price)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}