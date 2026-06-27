import { useState, useEffect } from "react";
import { Card, Badge } from "../components/ui";
import { healthService } from "../services/api";

const metrics = [
  { label: "Clients Cadastrados", value: "—", sub: "via API", accent: "#03045e" },
  { label: "Cache Hit Rate", value: "—", sub: "últimas 24h", accent: "#0077b6" },
  { label: "Latência Média", value: "—", sub: "cache hit", accent: "#00b4d8" },
  { label: "Tokens Renovados", value: "—", sub: "hoje", accent: "#90e0ef" },
];

type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";

const services = [
  { name: "springboot-token-manager-service", tech: "Spring Boot", role: "Serviço de Gerenciamento de Tokens", componentKey: "ping" },
  { name: "redis-token-cache", tech: "Redis", role: "Serviço de Cache de Tokens", componentKey: "redis" },
  { name: "vault-secrets-manager", tech: "HashiCorp Vault", role: "Serviço de Gerenciamento de Credenciais", componentKey: "vault" },
  { name: "keycloak-identity-provider", tech: "Keycloak", role: "Serviço de Autenticação e Identidade", componentKey: null },
];

const statusBadge: Record<ServiceStatus, "success" | "warning" | "error" | "gray"> = {
  healthy: "success", degraded: "warning", down: "error", unknown: "gray",
};
const statusLabel: Record<ServiceStatus, string> = {
  healthy: "Operacional", degraded: "Degradado", down: "Indisponível", unknown: "Desconhecido",
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-500 shrink-0">
    <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
  </svg>
);

const Dashboard = () => {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>({});
  const [apiStatus, setApiStatus] = useState<"loading" | "up" | "down">("loading");

  useEffect(() => {
    healthService.check()
      .then(data => {
        setApiStatus("up");
        const resolved: Record<string, ServiceStatus> = {};
        services.forEach(svc => {
          if (svc.componentKey && data.components?.[svc.componentKey]) {
            const s = data.components[svc.componentKey].status?.toLowerCase();
            resolved[svc.name] = s === "up" ? "healthy" : "degraded";
          } else if (!svc.componentKey) {
            resolved[svc.name] = "unknown";
          } else {
            resolved[svc.name] = "unknown";
          }
        });
        resolved["springboot-token-manager-service"] = "healthy";
        setStatuses(resolved);
      })
      .catch(() => {
        setApiStatus("down");
        const down: Record<string, ServiceStatus> = {};
        services.forEach(svc => { down[svc.name] = "down"; });
        setStatuses(down);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visão operacional do KRYPTOS
          {apiStatus === "down" && <span className="ml-2 text-error-500 font-medium">— API indisponível</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Card key={m.label} className="p-5 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: m.accent }} />
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">{m.label}</p>
            <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{m.sub}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #0077b6, #00b4d8)" }} />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Status dos Serviços</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {services.map(svc => {
            const status = statuses[svc.name] ?? "unknown";
            return (
              <div key={svc.name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {status === "healthy" && <CheckIcon />}
                  {status !== "healthy" && (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200 dark:border-gray-700 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{svc.role}</p>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500">{svc.tech}</p>
                  </div>
                </div>
                <Badge color={statusBadge[status]}>{statusLabel[status]}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
