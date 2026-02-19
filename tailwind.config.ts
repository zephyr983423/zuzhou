import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#f9d0d0",
          300: "#f3a8a8",
          400: "#ea7171",
          500: "#dc3545",
          600: "#c82333",
          700: "#a71d2a",
          800: "#8b1a23",
          900: "#6d1520",
          950: "#3b0a11",
        },
        curse: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      fontFamily: {
        gothic: ['"Cinzel"', '"Georgia"', "serif"],
        body: ['"Crimson Text"', '"Georgia"', "serif"],
      },
      animation: {
        "flicker": "flicker 3s infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
