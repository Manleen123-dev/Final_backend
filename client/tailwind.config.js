/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
      },
      boxShadow: {
        studio: "0 18px 60px rgba(22, 31, 26, 0.12)",
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
    },
  },
  plugins: [],
};
