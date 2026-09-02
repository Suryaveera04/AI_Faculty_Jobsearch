import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#0A192F",
          900: "#1E3A8A",
          800: "#1E40AF",
          700: "#1D4ED8",
          600: "#2563EB",
          500: "#3B82F6",
          400: "#60A5FA",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        gold: {
          800: "#78350F",
          700: "#92400E",
          600: "#B45309",
          500: "#D97706",
          400: "#F59E0B",
          300: "#FCD34D",
          200: "#FDE68A",
          100: "#FEF3C7",
          50: "#FFFBEB",
        },
        emerald: {
          800: "#065F46",
          700: "#047857",
          600: "#059669",
          500: "#10B981",
          100: "#D1FAE5",
          50: "#ECFDF5",
        },
        crimson: {
          700: "#B91C1C",
          600: "#DC2626",
          500: "#EF4444",
          100: "#FEE2E2",
          50: "#FEF2F2",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        'academic': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'academic-card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'academic-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'glow-gold': '0 0 20px -3px rgba(217, 119, 6, 0.25)',
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
