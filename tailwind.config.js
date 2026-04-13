/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366",
        secondary: "#003366",
        accent: "#00C2FF",
        light: "#EAF4FF",
        dark: "#0A192F",
        grayText: "#666666",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(to right, #003366, #004080, #003366)",
      },
    },
  },
  plugins: [],
}
