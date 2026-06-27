import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Alert } from "../components/ui";
import { mockClients } from "./ClientList";

type FormData = { clientId: string; realm: string; description: string; clientSecret: string };
type Errors = Partial<Record<keyof FormData, string>>;

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? mockClients.find(c => c.id === id) : null;
  const isEdit = !!existing;

  const [form, setForm] = useState<FormData>({
    clientId: existing?.clientId ?? "",
    realm: existing?.realm ?? "",
    description: existing?.description ?? "",
    clientSecret: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.clientId.trim()) e.clientId = "Client ID e obrigatorio";
    if (!form.realm.trim()) e.realm = "Realm e obrigatorio";
    if (!isEdit && !form.clientSecret.trim()) e.clientSecret = "Client Secret e obrigatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => navigate("/clients"), 1200);
  };

  const field = (key: keyof FormData, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}{key !== "description" && " *"}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${errors[key] ? "border-error-500" : "border-gray-200 dark:border-gray-700"}`} />
      {errors[key] && <p className="mt-1 text-xs text-error-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{isEdit ? "Editar Client" : "Novo Client"}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? `Editando ${existing?.clientId}` : "Cadastrar novo client OAuth2"}</p>
      </div>
      {saved && <Alert type="success">Client salvo com sucesso! Redirecionando...</Alert>}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {field("clientId", "Client ID", "text", "ex: app-mobile-client")}
          {field("realm", "Realm", "text", "ex: APP-Mobile")}
          {field("description", "Descricao", "text", "Descricao opcional")}
          {field("clientSecret", isEdit ? "Novo Client Secret (deixe vazio para manter)" : "Client Secret", "password", "••••••••")}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">{isEdit ? "Salvar Alteracoes" : "Cadastrar Client"}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/clients")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClientForm;
