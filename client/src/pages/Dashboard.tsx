import { useState, useEffect } from "react";
import { Users, DollarSign, CalendarCheck, ArrowUpRight } from "lucide-react";
import { apiFetch } from "../utils/api";


export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    revenue: 0,
    attendance: 0,
    recentActivity: [] as any[],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clients, payments, attendance] = await Promise.all([
          apiFetch("/clients").then((r) => r.json()),
          apiFetch("/payments").then((r) => r.json()),
          apiFetch("/attendance").then((r) => r.json()),
        ]);


        // Aggregate activity
        const activities = [
          ...clients
            .slice(0, 5)
            .map((c: any) => ({
              user: c.name,
              action: "Registro Nuevo",
              date: c.created_at,
              status: "Nuevo",
              type: "blue",
            })),
          ...payments
            .slice(0, 5)
            .map((p: any) => ({
              user: p.client_name,
              action: "Pago de Membresía",
              date: p.payment_date,
              status: "Completado",
              type: "green",
            })),
          ...attendance
            .slice(0, 5)
            .map((a: any) => ({
              user: a.client_name,
              action: "Ingreso al Gimnasio",
              date: a.check_in,
              status: "Presente",
              type: "purple",
            })),
        ]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 8);

        setStats({
          clients: clients.length,
          revenue: payments.reduce((acc: number, p: any) => acc + p.amount, 0),
          attendance: attendance.filter(
            (a: any) =>
              new Date(a.check_in).toDateString() === new Date().toDateString(),
          ).length,
          recentActivity: activities,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Clientes Activos",
      value: stats.clients,
      trend: "+12%",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.revenue.toLocaleString()}`,
      trend: "+8%",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Asistencias Hoy",
      value: stats.attendance,
      trend: "Normal",
      icon: CalendarCheck,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2 font-display">
                {card.value}
              </h3>
              <span
                className={`text-${card.trend.includes("+") ? "green" : "gray"}-500 text-xs font-semibold bg-${card.trend.includes("+") ? "green" : "gray"}-50 px-2 py-1 rounded-full mt-2 inline-block`}
              >
                {card.trend}
              </span>
            </div>
            <div className={`p-4 ${card.bg} ${card.color} rounded-full`}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            Actividad Reciente
          </h2>
          <button className="text-primary-600 text-sm font-medium hover:underline">
            Ver todo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {stats.recentActivity.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-400 italic"
                  >
                    No hay actividad reciente
                  </td>
                </tr>
              ) : (
                stats.recentActivity.map((act, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-${act.type}-100 text-${act.type}-600 flex items-center justify-center font-bold text-xs`}
                      >
                        {act.user?.charAt(0) || "U"}
                      </div>
                      {act.user}
                    </td>
                    <td className="px-6 py-4">{act.action}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(act.date).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 bg-${act.status === "Completado" || act.status === "Presente" ? "green" : "blue"}-100 text-${act.status === "Completado" || act.status === "Presente" ? "green" : "blue"}-700 rounded-full text-xs font-medium`}
                      >
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
