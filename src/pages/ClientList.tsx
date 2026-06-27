import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge, Button, Modal, Alert } from "../components/ui";
import { PlusIcon, PencilIcon, TrashIcon, RefreshIcon, SearchIcon } from "../icons";
import { clientService, tokenService, type Client } from "../services/api";

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Client | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setClients(await clientService.list());
    } catch {
      setError("Não foi possível carregar os clients. Verifique se a API está disponível.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter(c =>
    c.clientId.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setActionLoading(true);
    try {
      await tokenService.revoke(revokeTarget.clientId);
      setRevokeTarget(null);
    } catch {
      setError("Erro ao revogar token.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await clientService.remove(deleteTarget.clientId);
      setClients(c => c.filter(x => x.clientId !== deleteTarget.clientId));
      setDeleteTarget(null);
    } catch {
      setError("Erro ao remover client.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clientes OAuth2</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{clients.length} clients cadastrados</p>
        </div>
        <Button onClick={() => navigate("/clients/new")}><PlusIcon /> Novo Cliente</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <input type="text" placeholder="Buscar por client ID..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Client ID</TableCell>
              <TableCell isHeader>Realm</TableCell>
              <TableCell isHeader>Descrição</TableCell>
              <TableCell isHeader className="text-right">Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <tr><td colSpan={4} className="text-center text-sm text-gray-400 py-8">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-sm text-gray-400 py-8">Nenhum client encontrado</td></tr>
            ) : filtered.map(client => (
              <TableRow key={client.clientId}>
                <TableCell><span className="font-mono text-sm font-medium text-gray-900 dark:text-white">{client.clientId}</span></TableCell>
                <TableCell><Badge color="brand">{client.realm}</Badge></TableCell>
                <TableCell>{client.description || <span className="text-gray-400 italic">sem descrição</span>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setRevokeTarget(client)} title="Revogar cache"
                      className="p-1.5 text-gray-400 hover:text-warning-600 transition-colors"><RefreshIcon /></button>
                    <button onClick={() => navigate(`/clients/${client.clientId}/edit`)} title="Editar"
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
        footer={<><Button variant="secondary" onClick={() => setRevokeTarget(null)}>Cancelar</Button><Button onClick={handleRevoke} disabled={actionLoading}>Revogar</Button></>}>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deseja revogar o token de <span className="font-mono font-medium text-gray-900 dark:text-white">{revokeTarget?.clientId}</span>? A próxima requisição buscará um novo token.</p>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover Cliente"
        footer={<><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button><Button variant="danger" onClick={handleDelete} disabled={actionLoading}>Remover</Button></>}>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deseja remover <span className="font-mono font-medium text-gray-900 dark:text-white">{deleteTarget?.clientId}</span>? Esta ação remove o client do Keycloak e do Vault.</p>
      </Modal>
    </div>
  );
};

export default ClientList;
