/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563eb",
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },
                secondary: {
                    DEFAULT: "#475569",
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617",
                },
                accent: {
                    DEFAULT: "#f59e0b", // Energetic Amber
                    50: "#fffbeb",
                    100: "#fef3c7",
                    500: "#f59e0b",
                    600: "#d97706",
                },
                success: "#10b981",
                danger: "#ef4444",
                warning: "#f59e0b",
                info: "#3b82f6",
                background: "#f8fafc",
                surface: "#ffffff",
                text: {
                    DEFAULT: "#1e293b",
                    muted: "#64748b",
                    light: "#94a3b8",
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Montserrat', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gym-pattern': "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')", // Example gym background
            }
        },
    },
    plugins: [],
}
