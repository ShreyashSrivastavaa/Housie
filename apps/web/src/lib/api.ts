/**
 * API client resolving endpoint URLs dynamically based on execution context.
 *
 * In server-side contexts (Node.js runtime / Server Components / Route Handlers):
 *   Uses `process.env.API_URL` injected at runtime by Vercel service binding.
 *
 * In browser/client-side contexts:
 *   Uses relative `/api` path routed directly via Vercel top-level rewrites
 *   or optional `NEXT_PUBLIC_API_URL` override.
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server runtime: read the bound internal service URL
    return process.env.API_URL || 'http://localhost:4000';
  }
  // Client browser runtime: relative routing through Vercel public rewrite
  return process.env.NEXT_PUBLIC_API_URL || '';
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  let targetUrl: string;
  if (typeof window === 'undefined') {
    targetUrl = new URL(cleanPath.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
  } else {
    targetUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}${cleanPath}` : cleanPath;
  }

  const res = await fetch(targetUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as {
      error?: { code?: string; message?: string };
    };
    throw new Error(errorBody?.error?.message || `API request failed with HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
