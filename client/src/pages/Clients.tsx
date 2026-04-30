import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Modal from "../components/Modal";


interface Client {
  id: number;
  dni: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  photo_url: string | null;
  created_at: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchClients = async () => {
    try {
      const res = await apiFetch("/clients");
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        dni: client.dni,
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
      });
    } else {
      setEditingClient(null);
      setFormData({ dni: "", name: "", email: "", phone: "", address: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingClient
      ? `http://localhost:3000/api/clients/${editingClient.id}`
      : "http://localhost:3000/api/clients";
    const method = editingClient ? "PUT" : "POST";

    try {
      const res = await apiFetch(url.replace("http://localhost:3000/api", ""), {
        method,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchClients();
      } else {
        // Extraer el mensaje de error del backend
        const errorData = await res.json().catch(() => ({ error: "Error saving client" }));
        alert(errorData.error || "Error saving client");
      }
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Error de conexión al guardar el cliente");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await apiFetch(`/clients/${id}`, {
        method: "DELETE",
      });
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm),
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Clientes
          </h1>
          <p className="text-gray-500">Gestiona los miembros de tu gimnasio</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            Cargando clientes...
          </p>
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              No se encontraron clientes
            </p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {client.dni}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(client)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mt-4">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>
                  Registrado: {new Date(client.created_at).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  Activo
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI / Cédula
            </label>
            <input
              type="text"
              required
              value={formData.dni}
              onChange={(e) =>
                setFormData({ ...formData, dni: e.target.value })
              }
              className="input-field"
              placeholder="12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              placeholder="Juan Pérez"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field"
                placeholder="juan@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field"
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="input-field"
              placeholder="Calle 123 # 45-67"
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
              {editingClient ? "Guardar Cambios" : "Crear Cliente"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
