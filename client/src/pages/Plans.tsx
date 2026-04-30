import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  DollarSign,
} from "lucide-react";
import Modal from "../components/Modal";
import { apiFetch } from "../utils/api";

interface Plan {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  description: string | null;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form state
  // We need to handle number inputs carefully
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const fetchPlans = async () => {
    try {
      const res = await apiFetch("/plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        console.error("Data is not an array:", data);
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setPrice(plan.price.toString());
      setDuration(plan.duration_days.toString());
      setDescription(plan.description || "");
    } else {
      setEditingPlan(null);
      setName("");
      setPrice("");
      setDuration("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingPlan ? `/plans/${editingPlan.id}` : "/plans";
    const method = editingPlan ? "PUT" : "POST";

    const body = {
      name,
      price: parseFloat(price),
      duration_days: parseInt(duration),
      description,
    };

    try {
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPlans();
      } else {
        const errorData = await res.json();
        alert(`Error saving plan: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este plan?")) return;
    try {
      const res = await apiFetch(`/plans/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPlans();
      } else {
        alert("Error deleting plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Planes de Membresía
          </h1>
          <p className="text-gray-500">Configura los precios y duraciones</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} />
          Nuevo Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            Cargando planes...
          </p>
        ) : plans.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              No hay planes configurados
            </p>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 font-display">
                    {plan.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-3xl font-bold text-primary-600 mb-4 font-display">
                  ${plan.price.toLocaleString()}
                  <span className="text-sm text-gray-400 font-normal ml-1">
                    / {plan.duration_days} días
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-6 min-h-[3em]">
                  {plan.description || "Sin descripción"}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Calendar size={16} className="text-primary-400" />
                    <span>Duración: {plan.duration_days} días</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <DollarSign size={16} className="text-primary-400" />
                    <span>Precio fijo</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="w-full py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  Editar Plan
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? "Editar Plan" : "Nuevo Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Plan
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Ej. Mensual Básico"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (Días)
              </label>
              <input
                type="number"
                required
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field"
                placeholder="30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Detalles sobre lo que incluye este plan..."
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
              {editingPlan ? "Guardar Cambios" : "Crear Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
