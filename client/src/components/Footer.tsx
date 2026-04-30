import { Heart, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-white border-t border-gray-100 py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-gray-900 tracking-tight">
                Gym<span className="text-primary-600">Pay</span>
              </span>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                v1.2.0
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs text-center md:text-left leading-relaxed">
              La plataforma inteligente para la gestión de gimnasios y centros deportivos.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" aria-label="Github">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
              <a href="#" className="hover:text-primary-600 transition-colors">Términos</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Soporte</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p>© {currentYear} GymPay System. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            Hecho con <Heart size={12} className="text-red-500 fill-red-500" /> para profesionales del fitness
          </div>
        </div>
      </div>
    </footer>
  );
}
