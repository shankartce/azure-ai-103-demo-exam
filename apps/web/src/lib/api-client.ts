const DEFAULT_BASE_URL = "http://localhost:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;

// Check if API is configured in production
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const isApiConfigured = process.env.NEXT_PUBLIC_API_BASE_URL !== undefined;

if (isProduction && !isApiConfigured) {
  console.warn(
    '⚠️ API URL not configured! Set NEXT_PUBLIC_API_BASE_URL in Vercel environment variables.\n' +
    'The backend API needs to be deployed separately (e.g., on Render, Railway, or fly.io).'
  );
}

type ErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code = "request_failed",
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? ((await response.json()) as unknown) : null;

    if (!response.ok) {
      const envelope = payload as ErrorEnvelope | null;
      const errorMessage = envelope?.error?.message ?? "Request failed";
      const errorCode = envelope?.error?.code ?? "request_failed";
      const errorDetails = envelope?.error?.details;

      throw new ApiClientError(errorMessage, response.status, errorCode, errorDetails);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Network error - API not reachable
    if (error instanceof TypeError) {
      throw new ApiClientError(
        "Cannot connect to API server. Please ensure the backend is deployed and NEXT_PUBLIC_API_BASE_URL is configured.",
        0,
        "network_error"
      );
    }
    
    throw error;
  }
}

export async function apiJson<T>(
  path: string,
  body: unknown,
  options: RequestInit = {}
) {
  return apiRequest<T>(path, {
    ...options,
    method: options.method ?? "POST",
    body: JSON.stringify(body),
  });
}
