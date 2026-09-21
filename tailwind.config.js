/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rccg: {
          blue: "#003366",
          navy: "#002244",
          lightBlue: "#005A9C",
          red: "#ED1B24",
          green: "#009245",
          accent: "#22c55e",
        }
      }
    },
  },
  plugins: [],
}
