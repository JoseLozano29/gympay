import { useState, useEffect } from "react";
import { UserCheck, Clock, User, LogIn } from "lucide-react";
import { apiFetch } from "../utils/api";

interface AttendanceRecord {
  id: number;
  client_id: number;
  client_name: string;
  client_dni: string;
  check_in: string;
}

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dni, setDni] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchAttendance = async () => {
    try {
      const res = await apiFetch("/attendance");
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni) return;

    try {
      const res = await apiFetch("/attendance", {
        method: "POST",
        body: JSON.stringify({ dni }),
      });

      // Extraemos el JSON de forma segura
      const data = await res.json().catch(() => ({ error: "Error inesperado" }));

      if (res.ok) {
        setMessage({
          text: `Entrada registrada para: ${data.data?.client_id || ""}`,
          type: "success",
        });
        setDni("");
        fetchAttendance();
      } else {
        setMessage({
          text: data.error || "Error al registrar asistencia",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión", type: "error" });
    }

    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Control de Asistencia
        </h1>
        <p className="text-gray-500">
          Registra y visualiza la entrada de los clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                <UserCheck size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Registrar Entrada
              </h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  DNI del Cliente
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ingrese identificación..."
                    className="input-field pl-10"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Marcar Entrada
              </button>
            </form>

            {message.text && (
              <div
                className={`mt-4 p-4 rounded-lg text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock size={20} className="text-gray-400" />
                Ingresos Recientes
              </h2>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center text-gray-500">
                  Cargando...
                </div>
              ) : attendance.length === 0 ? (
                <div className="p-10 text-center text-gray-500 italic">
                  No hay registros de hoy
                </div>
              ) : (
                attendance.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                        {record.client_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {record.client_name || "Cargando..."}
                        </p>
                        <p className="text-xs text-gray-500">
                          DNI: {record.client_dni}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-600">
                        {new Date(record.check_in).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.check_in).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}