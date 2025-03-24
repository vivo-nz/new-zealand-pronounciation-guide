
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidAudioUrl(url: string | undefined): boolean {
  if (!url || url.trim() === '') {
    return false;
  }
  
  // Check if it's a valid URL or a valid file path
  try {
    // Try to create a URL object to validate it
    new URL(url, window.location.origin);
    return true;
  } catch (e) {
    // If it's not a valid URL, check if it's a valid file path
    return url.includes('.') && /\.(mp3|wav|ogg|m4a)$/i.test(url);
  }
}
