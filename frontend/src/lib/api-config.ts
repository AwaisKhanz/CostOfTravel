/**
 * API Configuration
 * 
 * In production (single-server), we use relative paths (/api).
 * In development, we use the specified API URL or fallback to localhost:8000.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (IS_PRODUCTION ? '/api' : 'http://localhost:8000/api');

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  // If it's a relative path in production, just return /api/path
  // If it's an absolute URL in development, return base + path
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${base}${cleanPath}`;
};
