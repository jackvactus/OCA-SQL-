import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Only allow same-origin relative paths as a post-login redirect target,
 * so a crafted `?next=` query can't be used to bounce a user off-site.
 */
export function sanitizeRedirectPath(path: string | null | undefined, fallback = "/tracks") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return fallback;
  }
  return path;
}
