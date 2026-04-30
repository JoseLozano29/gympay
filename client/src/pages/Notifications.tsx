import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  Info,
  Plus,
} from "lucide-react";
import { apiFetch } from "../utils/api";
import Modal from "../components/Modal";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  dni: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await apiFetch("/clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchClients();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, {
        method: "PUT",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    await Promise.all(unread.map((n) => markAsRead(n.id)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }
    if (!message.trim()) {
      alert("El mensaje es obligatorio");
      return;
    }

    const body: any = {
      title: title.trim(),
      message: message.trim(),
    };
    if (selectedClientId) {
      body.client_id = parseInt(selectedClientId);
    }

    try {
      const res = await apiFetch("/notifications", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setMessage("");
        setSelectedClientId("");
        fetchNotifications();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Error al crear la notificación");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Error de conexión al crear la notificación");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Notificaciones
          </h1>
          <p className="text-gray-500">Alertas del sistema y recordatorios</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Plus size={20} />
            Nueva Notificación
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Cargando notificaciones...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No tienes notificaciones</p>
            <p className="text-sm">
              Te avisaremos cuando pase algo importante.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 flex gap-4 transition-colors ${n.is_read ? "opacity-60" : "bg-primary-50/10"}`}
              >
                <div
                  className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
                    n.is_read
                      ? "bg-gray-100 text-gray-400"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-bold ${n.is_read ? "text-gray-700" : "text-gray-900"}`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {n.message}
                  </p>
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para nueva notificación */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Notificación"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Recordatorio de pago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
              placeholder="Escribe el contenido de la notificación..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente (opcional)
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="input-field appearance-none bg-white"
            >
              <option value="">Todos los clientes (general)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.dni}
                </option>
              ))}
            </select>
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
              Crear Notificación
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}