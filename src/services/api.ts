const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8090";

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  realm: string;
  clientId: string;
};

export const tokenService = {
  async requestToken(clientId: string, realm: string): Promise<TokenResponse> {
    const res = await fetch(`${BASE_URL}/api/v1/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, realm }),
    });
    if (!res.ok) throw new Error(`Erro ao solicitar token: ${res.status}`);
    return res.json();
  },

  async revokeToken(clientId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/v1/tokens/${clientId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Erro ao revogar token: ${res.status}`);
  },

  async healthCheck(): Promise<{ status: string }> {
    const res = await fetch(`${BASE_URL}/actuator/health`);
    if (!res.ok) throw new Error("Health check falhou");
    return res.json();
  },
};
