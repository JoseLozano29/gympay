import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Search,
  Fingerprint,
} from "lucide-react";
import { apiFetch } from "../utils/api";

interface AccessLog {
  id: number;
  client_name: string;
  check_in: string;
  status: string;
}

export default function AccessControl() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await apiFetch("/attendance");
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        setLogs([]);
        return;
      }

      // Simulate status based on membership (actually attendance list for now)
      setLogs(
        data.map((d: any) => ({
          ...d,
          status: Math.random() > 0.1 ? "Permitido" : "Denegado", // Simulation
        })),
      );
    } catch (error) {
      console.error("Error fetching access logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Control de Acceso
          </h1>
          <p className="text-gray-500">
            Monitoreo de entradas y validación de membresías
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 font-bold text-sm">
          <Shield size={18} />
          Sistema Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Fingerprint size={20} className="text-primary-600" />
              Estado del Molinete
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Entrada Principal</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                  ACTIVO
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  Salida de Emergencia
                </span>
                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-bold">
                  CERRADO
                </span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors">
              Abrir Manualmente
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Últimos Accesos</h3>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Filtrar logs..."
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Usuario</th>
                    <th className="px-6 py-3">Hora</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {log.client_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(log.check_in).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`flex items-center gap-1 text-xs font-bold ${
                              log.status === "Permitido"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {log.status === "Permitido" ? (
                              <ShieldCheck size={14} />
                            ) : (
                              <ShieldAlert size={14} />
                            )}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-primary-600 hover:underline">
                            Ver ficha
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
