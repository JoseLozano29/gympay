import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  DollarSign,
  Receipt,
  CalendarDays,
  Key,
  BarChart,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import clsx from "clsx";


export default function Sidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error calling logout endpoint", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };


  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clientes", path: "/clients" },
    { icon: CreditCard, label: "Membresías", path: "/memberships" },
    { icon: Package, label: "Planes", path: "/plans" },
    { icon: DollarSign, label: "Pagos", path: "/payments" },
    { icon: Receipt, label: "Facturas", path: "/invoices" },
    { icon: CalendarDays, label: "Asistencia", path: "/attendance" },
    { icon: Key, label: "Control de Acceso", path: "/access-control" },
    { icon: BarChart, label: "Reportes", path: "/reports" },
    { icon: Bell, label: "Notificaciones", path: "/notifications" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 z-30 h-full w-64 bg-secondary-900 text-white border-r border-secondary-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-secondary-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-tight">
            <span className="text-white">GymPay</span>
            <span className="w-2 h-2 rounded-full bg-primary-500 mt-2"></span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-secondary-400 hover:text-white p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && closeSidebar()}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                    : "text-secondary-400 hover:bg-secondary-800 hover:text-white",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-6 mt-6 border-t border-secondary-800">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-secondary-400 hover:bg-secondary-800 hover:text-white",
                )
              }
            >
              <Settings size={18} />
              Configuración
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
