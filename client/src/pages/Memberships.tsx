import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { Plus, Search } from "lucide-react";
import Modal from "../components/Modal";

interface Membership {
  id: number;
  client_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: string;
  price_paid: number;
  client_name: string;
  plan_name: string;
}

interface Client {
  id: number;
  name: string;
  dni: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  duration_days: number;
}

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchData = async () => {
    try {
      const [membershipsRes, clientsRes, plansRes] = await Promise.all([
        apiFetch("/memberships"),
        apiFetch("/clients"),
        apiFetch("/plans"),
      ]);

      setMemberships(await membershipsRes.json());
      setClients(await clientsRes.json());
      setPlans(await plansRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedPlan) return;

    try {
      const res = await apiFetch("/memberships", {
        method: "POST",
        body: JSON.stringify({
          client_id: parseInt(selectedClient),
          plan_id: parseInt(selectedPlan),
          start_date: startDate,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Error creating membership");
      }
    } catch (error) {
      console.error("Error creating membership:", error);
    }
  };

  const getStatusColor = (status: string, endDate: string) => {
    const isExpired = new Date(endDate) < new Date();
    if (status === "active" && !isExpired) return "bg-green-100 text-green-700";
    if (status === "inactive") return "bg-gray-100 text-gray-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusText = (status: string, endDate: string) => {
    const isExpired = new Date(endDate) < new Date();
    if (status === "active" && !isExpired) return "Activa";
    if (status === "inactive") return "Inactiva";
    return "Vencida";
  };

  const filteredMemberships = memberships.filter((membership) =>
    membership.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Membresías
          </h1>
          <p className="text-gray-500">Administra las suscripciones activas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} />
          Nueva Membresía
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre de cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Memberships List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Cliente
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Plan
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Fecha Inicio
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Fecha Vencimiento
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Estado
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Cargando membresías...
                  </td>
                </tr>
              ) : filteredMemberships.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No hay membresías registradas
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((membership) => (
                  <tr
                    key={membership.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {membership.client_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {membership.plan_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(membership.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(membership.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          membership.status,
                          membership.end_date,
                        )}`}
                      >
                        {getStatusText(membership.status, membership.end_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${membership.price_paid.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Membresía"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              required
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="input-field appearance-none bg-white"
            >
              <option value="">Seleccione un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.dni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              required
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="input-field appearance-none bg-white"
            >
              <option value="">Seleccione un plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price} ({plan.duration_days} días)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Crear Membresía
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}