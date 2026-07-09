import Constants from 'expo-constants';

/**
 * URL de base de l'API. Prise depuis app.json (extra.apiUrl) ; sur un appareil
 * physique, remplace localhost par l'IP de ta machine dans app.json.
 */
const API_URL: string =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  'http://localhost:3000/api';

let authToken: string | null = null;

/** Définit (ou efface) le jeton envoyé dans l'en-tête Authorization. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Requête sans jeton (auth publique). */
  anonymous?: boolean;
}

/** Effectue une requête JSON vers l'API et gère les erreurs. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, anonymous = false } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!anonymous && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifie ta connexion.');
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const message = extractMessage(data) ?? `Erreur ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message: unknown }).message;
    if (Array.isArray(m)) return m.join('\n');
    if (typeof m === 'string') return m;
  }
  return undefined;
}
