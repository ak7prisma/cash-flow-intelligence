/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'base-light': '#F8F9FA',
        'base-dark': '#0A0E14',
      }
    },
  },
  plugins: [],
}