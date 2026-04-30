import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Building,
  Bell,
  Shield,
  Paintbrush,
  Download,
  Database,
} from "lucide-react";
import { apiFetch } from "../utils/api";

export default function Settings() {
  const [settings, setSettings] = useState({
    gym_name: "GymPay Centro",
    email: "contacto@gympay.com",
    address: "Calle Principal #123",
    notifications_enabled: "true",
    theme: "dark",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchSettings = async () => {
      try {
        const res = await apiFetch("/settings");
        const data = await res.json();
        if (data.length > 0) {
          const mapped = data.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }),
            {},
          );
          setSettings((prev) => ({ ...prev, ...mapped }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await apiFetch("/settings", {
          method: "POST",
          body: JSON.stringify({ key, value }),
        });
      }
      alert("Configuración guardada");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const response = await apiFetch("/admin/backup/download");
      if (!response.ok) throw new Error("Error descargando backup");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gympay_backup.sqlite";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "appearance", label: "Apariencia", icon: Paintbrush },
    ...(user?.role === "admin" ? [{ id: "backup", label: "Respaldo", icon: Database }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Configuración
        </h1>
        <p className="text-gray-500">
          Administra los parámetros globales del sistema
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                tab.id === activeTab
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "text-gray-500 hover:bg-white hover:text-primary-600"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nombre del Gimnasio
                    </label>
                    <input
                      type="text"
                      value={settings.gym_name}
                      onChange={(e) =>
                        setSettings({ ...settings, gym_name: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-8"
                  >
                    <Save size={18} />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Notificaciones por Email
                    </p>
                    <p className="text-xs text-gray-500">
                      Enviar alertas automáticas a los clientes
                    </p>
                  </div>
                  <div
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications_enabled:
                          settings.notifications_enabled === "true"
                            ? "false"
                            : "true",
                      })
                    }
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${settings.notifications_enabled === "true" ? "bg-primary-600" : "bg-gray-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications_enabled === "true" ? "left-7" : "left-1"}`}
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-8">
                    <Save size={18} />
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}

            {activeTab === "backup" && user?.role === "admin" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Database size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">Respaldo del Sistema</h3>
                      <p className="text-sm text-blue-800/80 leading-relaxed">
                        Como administrador, puedes descargar una copia completa de la base de datos local (SQLite). 
                        Se recomienda realizar esta acción periódicamente para evitar pérdida de datos.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      onClick={handleDownloadBackup}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                      <Download size={20} />
                      Descargar Base de Datos (.sqlite)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "security" || activeTab === "appearance") && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic text-sm">
                Estas opciones estarán disponibles en la próxima actualización.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
