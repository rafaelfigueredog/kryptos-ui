import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge, Button, Modal } from "../components/ui";
import { PlusIcon, PencilIcon, TrashIcon, RefreshIcon, SearchIcon } from "../icons";

export type Client = {
  id: string;
  clientId: string;
  realm: string;
  description: string;
  cached: boolean;
};

export const mockClients: Client[] = [
  { id: "1", clientId: "app-mobile-client", realm: "APP-Mobile", description: "Aplicativo Mobile", cached: true },
  { id: "2", clientId: "servico-pagamento", realm: "APP-Mobile", description: "Servico de Pagamento", cached: false },
  { id: "3", clientId: "portal-web", realm: "Portal-Interno", description: "Portal Web Interno", cached: true },
];

const ClientList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState(mockClients);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Client | null>(null);

  const filtered = clients.filter(c =>
    c.clientId.toLowerCase().includes(search.toLowerCase()) ||
    c.realm.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteTarget) { setClients(c => c.filter(x => x.id !== deleteTarget.id)); setDeleteTarget(null); }
  };
  const handleRevoke = () => {
    if (revokeTarget) { setClients(c => c.map(x => x.id === revokeTarget.id ? { ...x, cached: false } : x)); setRevokeTarget(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{clients.length} clients cadastrados</p>
        </div>
        <Button onClick={() => navigate("/clients/new")}><PlusIcon /> Novo Client</Button>
      </div>
      <Card>
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <input type="text" placeholder="Buscar por client ou realm..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Client ID</TableCell>
              <TableCell isHeader>Realm</TableCell>
              <TableCell isHeader>Descricao</TableCell>
              <TableCell isHeader>Cache</TableCell>
              <TableCell isHeader className="text-right">Acoes</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-sm text-gray-400 py-8">Nenhum client encontrado</td></tr>
            ) : filtered.map(client => (
              <TableRow key={client.id}>
                <TableCell><span className="font-mono text-sm font-medium text-gray-900 dark:text-white">{client.clientId}</span></TableCell>
                <TableCell><Badge color="brand">{client.realm}</Badge></TableCell>
                <TableCell>{client.description}</TableCell>
                <TableCell><Badge color={client.cached ? "success" : "gray"}>{client.cached ? "Em cache" : "Sem cache"}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setRevokeTarget(client)} disabled={!client.cached} title="Revogar cache"
                      className="p-1.5 text-gray-400 hover:text-warning-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><RefreshIcon /></button>
                    <button onClick={() => navigate(`/clients/${client.id}/edit`)} title="Editar"
                      className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors"><PencilIcon /></button>
                    <button onClick={() => setDeleteTarget(client)} title="Remover"
                      className="p-1.5 text-gray-400 hover:text-error-500 transition-colors"><TrashIcon /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={!!revokeTarget} onClose={() => setRevokeTarget(null)} title="Revogar Token do Cache"
        footer={<><Button variant="secondary" onClick={() => setRevokeTarget(null)}>Cancelar</Button><Button onClick={handleRevoke}>Revogar</Button></>}>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deseja revogar o token de <span className="font-mono font-medium text-gray-900 dark:text-white">{revokeTarget?.clientId}</span>? A proxima requisicao buscara um novo token.</p>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover Client"
        footer={<><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Remover</Button></>}>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deseja remover o client <span className="font-mono font-medium text-gray-900 dark:text-white">{deleteTarget?.clientId}</span>? Esta acao nao pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default ClientList;
