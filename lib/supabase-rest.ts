type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type QueryValue = string | number | boolean;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    url: url.replace(/\/+$/, ""),
    serviceRoleKey,
  };
}

export function isSupabaseConfigured() {
  const { url, serviceRoleKey } = getSupabaseConfig();
  return Boolean(url && serviceRoleKey);
}

function buildQuery(params?: Record<string, QueryValue>) {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }

  return `?${query.toString()}`;
}

async function request<T>(method: HttpMethod, table: string, options?: {
  query?: Record<string, QueryValue>;
  body?: unknown;
  prefer?: string;
}) {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(
    `${url}/rest/v1/${table}${buildQuery(options?.query)}`,
    {
      method,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: options?.prefer || "return=representation",
      },
      cache: "no-store",
      body: options?.body ? JSON.stringify(options.body) : undefined,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function supabaseSelect<T>(table: string, query?: Record<string, QueryValue>) {
  return request<T[]>("GET", table, { query });
}

export async function supabaseInsert<T>(table: string, body: unknown) {
  return request<T[]>("POST", table, { body });
}

export async function supabaseUpdate<T>(
  table: string,
  match: Record<string, QueryValue>,
  body: unknown
) {
  return request<T[]>("PATCH", table, { query: match, body });
}

export async function supabaseDelete(
  table: string,
  match: Record<string, QueryValue>
) {
  return request<null>("DELETE", table, { query: match, prefer: "return=minimal" });
}
