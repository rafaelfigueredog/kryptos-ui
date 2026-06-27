import { Card, Badge } from "../components/ui";

const metrics = [
  { label: "Clients Cadastrados", value: "3", sub: "realms ativos", color: "text-brand-500", bg: "bg-brand-50 dark:bg-brand-500/10" },
  { label: "Cache Hit Rate", value: "94%", sub: "últimas 24h", color: "text-success-600", bg: "bg-success-50 dark:bg-success-500/10" },
  { label: "Latência Média", value: "6ms", sub: "cache hit", color: "text-warning-600", bg: "bg-warning-50 dark:bg-warning-500/10" },
  { label: "Tokens Renovados", value: "128", sub: "hoje", color: "text-gray-700 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-800" },
];

const services = [
  { name: "API", status: "healthy" as const },
  { name: "Redis", status: "healthy" as const },
  { name: "Vault", status: "healthy" as const },
  { name: "RH-SSO", status: "healthy" as const },
];

type Status = "healthy" | "degraded" | "down";
const statusBadge: Record<Status, "success" | "warning" | "error"> = {
  healthy: "success",
  degraded: "warning",
  down: "error",
};
const statusLabel: Record<Status, string> = {
  healthy: "Operacional",
  degraded: "Degradado",
  down: "Indisponível",
};

const Dashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visão operacional do KRYPTOS</p>
    </div>

    {/* Métricas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map(m => (
        <Card key={m.label} className="p-5">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${m.bg}`}>
            <span className={`text-lg font-bold ${m.color}`}>#</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{m.label}</p>
          <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{m.sub}</p>
        </Card>
      ))}
    </div>

    {/* Status dos serviços */}
    <Card>
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Status dos Serviços</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {services.map(svc => (
          <div key={svc.name} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{svc.name}</span>
            <Badge color={statusBadge[svc.status]}>{statusLabel[svc.status]}</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default Dashboard;
