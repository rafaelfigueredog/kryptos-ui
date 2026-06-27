const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8090";

export type Client = {
  clientId: string;
  description: string;
  realm: string;
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  realm: string;
};

const api = async (path: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
};

export const clientService = {
  list: (): Promise<Client[]> => api("/api/v1/clients"),

  create: (clientId: string, clientSecret: string, description: string): Promise<Client> =>
    api("/api/v1/clients", { method: "POST", body: JSON.stringify({ clientId, clientSecret, description }) }),

  update: (clientId: string, clientSecret: string, description: string): Promise<Client> =>
    api(`/api/v1/clients/${clientId}`, { method: "PUT", body: JSON.stringify({ clientId, clientSecret, description }) }),

  remove: (clientId: string): Promise<null> =>
    api(`/api/v1/clients/${clientId}`, { method: "DELETE" }),
};

export const tokenService = {
  request: (clientId: string): Promise<TokenResponse> =>
    api("/api/v1/tokens", { method: "POST", body: JSON.stringify({ clientId }) }),

  revoke: (clientId: string): Promise<null> =>
    api(`/api/v1/tokens/${clientId}`, { method: "DELETE" }),
};

export const healthService = {
  check: (): Promise<{ status: string; components: Record<string, { status: string }> }> =>
    api("/actuator/health"),
};
