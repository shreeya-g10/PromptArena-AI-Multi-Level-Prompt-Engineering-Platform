/**
 * Backend API URL for fetch().
 * - If `VITE_API_BASE_URL` is set (e.g. http://localhost:3000), use it + path.
 * - Otherwise use a same-origin path (e.g. /api/level1) so Vite dev proxy can forward to the backend.
 */
export function apiPath(path: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  if (base) return `${base}${p}`;
  return p;
}
