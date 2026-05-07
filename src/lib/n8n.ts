const DEFAULT_BASE_URL = 'http://localhost:5678';

const n8nBaseUrl = (
  import.meta.env.VITE_N8N_BASE_URL?.trim() || DEFAULT_BASE_URL
).replace(/\/+$/, '');

const n8nApiKey = import.meta.env.VITE_N8N_API_KEY?.trim();

function buildHeaders(headers?: HeadersInit) {
  const merged = new Headers(headers);

  if (n8nApiKey && !merged.has('x-logisync-key')) {
    merged.set('x-logisync-key', n8nApiKey);
  }

  return merged;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`n8n respondio con ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchN8n<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${n8nBaseUrl}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers),
  });

  return parseResponse<T>(response);
}

export async function postN8n<T>(path: string, body?: unknown): Promise<T> {
  return fetchN8n<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function getN8nBaseUrl() {
  return n8nBaseUrl;
}
