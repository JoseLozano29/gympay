import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { apiFetch } from "../utils/api";

export default function Reports() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeMemberships: 0,
    monthlyRevenue: 0,
    lastMonthRevenue: 0,
  });

  const fetchStats = async () => {
    try {
      const [clientsRes, paymentsRes, membershipsRes] = await Promise.all([
        apiFetch("/clients"),
        apiFetch("/payments"),
        apiFetch("/memberships"),
      ]);

      const [clients, payments, memberships] = await Promise.all([
        clientsRes.json(),
        paymentsRes.json(),
        membershipsRes.json(),
      ]);

      setStats({
        totalClients: Array.isArray(clients) ? clients.length : 0,
        activeMemberships: Array.isArray(memberships) 
          ? memberships.filter((m: any) => m.status === "active").length 
          : 0,
        monthlyRevenue: Array.isArray(payments)
          ? payments.reduce((acc: number, p: any) => acc + p.amount, 0)
          : 0,
        lastMonthRevenue: 15000, // Hardcoded for demo
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Ingresos Totales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "bg-green-500",
    },
    {
      title: "Clientes Totales",
      value: stats.totalClients,
      icon: Users,
      trend: "+3.2%",
      color: "bg-blue-500",
    },
    {
      title: "Membresías Activas",
      value: stats.activeMemberships,
      icon: Calendar,
      trend: "+5.4%",
      color: "bg-purple-500",
    },
    {
      title: "Retención",
      value: "88%",
      icon: TrendingUp,
      trend: "+1.2%",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-500">Analiza el rendimiento de tu gimnasio</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {card.trend}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Ingresos Mensuales
          </h3>
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 65, 45, 90, 75, 55, 80, 60, 95, 70, 85, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="w-full bg-primary-100 group-hover:bg-primary-500 transition-colors rounded-t-sm relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(h * 100).toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  Mes {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Distribución de Planes
          </h3>
          <div className="space-y-6">
            {[
              { label: "Plan Mensual", value: 65, color: "bg-blue-500" },
              { label: "Plan Anual", value: 20, color: "bg-purple-500" },
              { label: "Plan Trimestral", value: 15, color: "bg-orange-500" },
            ].map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{p.label}</span>
                  <span className="font-bold text-gray-900">{p.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.color}`}
                    style={{ width: `${p.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
