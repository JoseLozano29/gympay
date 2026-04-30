import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  DollarSign,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import Modal from "../components/Modal";
import { apiFetch } from "../utils/api";

interface Payment {
  id: number;
  client_id: number;
  client_name: string;
  amount: number;
  payment_date: string;
  method: string;
  reference: string | null;
  invoice_number?: string;
}

interface Client {
  id: number;
  name: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    amount: "",
    method: "Efectivo",
    reference: "",
  });

  const fetchData = async () => {
    try {
      const [paymentsRes, clientsRes] = await Promise.all([
        apiFetch("/payments"),
        apiFetch("/clients"),
      ]);
      const paymentsData = await paymentsRes.json();
      const clientsData = await clientsRes.json();
      
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
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
    try {
      const res = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          client_id: parseInt(formData.client_id),
          amount: parseFloat(formData.amount),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          client_id: "",
          amount: "",
          method: "Efectivo",
          reference: "",
        });
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Error al registrar el pago: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Pagos
          </h1>
          <p className="text-gray-500">Historial de transacciones y cobros</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} />
          Registrar Pago
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o método..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Cargando pagos...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No se encontraron pagos
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {payment.client_name}
                    </td>
                    <td className="px-6 py-4 text-primary-600 font-bold">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(payment.payment_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.invoice_number ? (
                        <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                          {payment.invoice_number}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Sin factura
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {payment.reference || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Pago"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              required
              value={formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
              className="input-field"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="input-field pl-9"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={formData.method}
              onChange={(e) =>
                setFormData({ ...formData, method: e.target.value })
              }
              className="input-field"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia (Opcional)
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
              className="input-field"
              placeholder="Número de comprobante"
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
              Registrar Pago
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
