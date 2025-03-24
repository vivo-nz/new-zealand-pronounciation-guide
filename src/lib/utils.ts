
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidAudioUrl(url: string | undefined): boolean {
  return Boolean(url && url.trim() !== '');
}
