import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#042F1A",
        emerald: "#059669",
        accent: "#10B981",
        mint: "#F0FDF4",
        platinum: "#FAFAFA",
        charcoal: "#0F172A",
        slateBorder: "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 25px 50px -12px rgba(4, 47, 26, 0.1)",
        glow: "0 0 40px rgba(16, 185, 129, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
