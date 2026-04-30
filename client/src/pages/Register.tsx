import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Dumbbell } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Error al registrarse");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary-800/80 z-10" />

        <div className="relative z-20 flex flex-col justify-between p-12 w-full text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Dumbbell className="w-8 h-8 text-primary-300" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              GymPay
            </span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Únete a la nueva era del{" "}
              <span className="text-primary-300">fitness</span>.
            </h1>
            <p className="text-lg text-primary-100/90 leading-relaxed">
              Registra tu gimnasio hoy mismo y comienza a optimizar tus procesos
              administrativos.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-primary-200">
            <span>© 2024 GymPay System</span>
            <div className="h-1 w-1 rounded-full bg-primary-400"></div>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-secondary-900 font-display">
              Crear una cuenta (Demo)
            </h2>
            <p className="mt-2 text-secondary-500">
              Completa tus datos para empezar
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-fadeIn">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700 ml-1">
                Nombre Completo
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10 py-3 bg-secondary-50 border-secondary-200 focus:bg-white"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700 ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 py-3 bg-secondary-50 border-secondary-200 focus:bg-white"
                  placeholder="ejemplo@gympay.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary-700 ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 py-3 bg-secondary-50 border-secondary-200 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-secondary-500 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
