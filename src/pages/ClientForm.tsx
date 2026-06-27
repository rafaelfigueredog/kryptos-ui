import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Alert } from "../components/ui";
import { clientService } from "../services/api";

type FormData = { clientId: string; description: string; clientSecret: string };
type Errors = Partial<Record<keyof FormData, string>>;

const ClientForm = () => {
  const { clientId: paramClientId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!paramClientId;

  const [form, setForm] = useState<FormData>({ clientId: "", description: "", clientSecret: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (isEdit) setForm(f => ({ ...f, clientId: paramClientId }));
  }, [isEdit, paramClientId]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.clientId.trim()) e.clientId = "Client ID é obrigatório";
    if (!isEdit && !form.clientSecret.trim()) e.clientSecret = "Client Secret é obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await clientService.update(form.clientId, form.clientSecret, form.description);
      } else {
        await clientService.create(form.clientId, form.clientSecret, form.description);
      }
      setFeedback({ type: "success", msg: `Cliente ${isEdit ? "atualizado" : "cadastrado"} com sucesso!` });
      setTimeout(() => navigate("/clients"), 1200);
    } catch {
      setFeedback({ type: "error", msg: "Erro ao salvar client. Verifique os dados e tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof FormData, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}{key !== "description" && (isEdit && key === "clientSecret" ? "" : " *")}
      </label>
      <input type={type} value={form[key]} placeholder={placeholder}
        disabled={isEdit && key === "clientId"}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${errors[key] ? "border-error-500" : "border-gray-200 dark:border-gray-700"}`} />
      {errors[key] && <p className="mt-1 text-xs text-error-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{isEdit ? "Editar Cliente" : "Novo Cliente"}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? `Editando ${paramClientId}` : "Cadastrar novo client OAuth2 no realm kryptos"}</p>
      </div>

      {feedback && <Alert type={feedback.type}>{feedback.msg}</Alert>}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {field("clientId", "Client ID", "text", "ex: minha-api")}
          {field("description", "Descrição", "text", "Descrição opcional")}
          {field("clientSecret", isEdit ? "Novo Client Secret (deixe vazio para não alterar)" : "Client Secret", "password", "••••••••")}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : isEdit ? "Salvar Alterações" : "Cadastrar Cliente"}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/clients")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClientForm;
