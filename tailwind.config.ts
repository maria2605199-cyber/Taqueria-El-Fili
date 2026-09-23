import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f2ff",
          100: "#e6e5ff",
          200: "#c3c1ff",
          300: "#a09dff",
          400: "#7d78ff",
          500: "#6c5ce7",
          600: "#5541d1",
          700: "#4433a6",
          800: "#33267a",
          900: "#221a52",
          950: "#130e33",
        },
        ink: {
          950: "#05060a",
          900: "#0a0c14",
          800: "#10131e",
          700: "#171b29",
          600: "#232838",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(108,92,231,0.45)",
        card: "0 4px 24px -8px rgba(0,0,0,0.15)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 0%, rgba(108,92,231,0.25), transparent 45%), radial-gradient(circle at 80% 20%, rgba(0,214,201,0.18), transparent 40%)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
