import { Bell, Menu, Search, User } from "lucide-react";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64">
          <Search size={18} className="mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-700">
              {user.name || "Usuario"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role || "Admin"}
            </p>
          </div>
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {user.name ? user.name[0].toUpperCase() : <User size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
}
