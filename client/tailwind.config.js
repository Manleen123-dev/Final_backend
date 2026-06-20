/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          ink: "#111411",
          muted: "#657067",
          canvas: "#f7f8f3",
          panel: "#ffffff",
          line: "#dde4dc",
          green: "#176b52",
          greenDark: "#0f4f3d",
          greenSoft: "#dff4e8",
          amber: "#bd7a00",
          red: "#b42318",
        },
        apple: {
          black: "#050505",
          near: "#111113",
          gray: "#86868b",
          line: "#d7d7dc",
          cloud: "#f5f5f7",
          blue: "#0071e3",
        },
      },
      boxShadow: {
        studio: "0 18px 60px rgba(22, 31, 26, 0.12)",
        premium: "0 24px 80px rgba(0, 0, 0, 0.10)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "hero-light":
          "radial-gradient(circle at 50% 0%, rgba(0,113,227,0.16), transparent 34rem), linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)",
        "hero-dark":
          "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 30rem), linear-gradient(180deg, #050505 0%, #121214 100%)",
      },
    },
  },
  plugins: [],
};
