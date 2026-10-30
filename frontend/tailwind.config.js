/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          50: '#f4f6f4',
          100: '#e5ece5',
          200: '#cbdacb',
          500: '#4b6351',
          700: '#2d3e32',
          800: '#233027',
          900: '#1a231d',
        },
        navy: {
          800: '#14213d',
          900: '#0b132b',
          950: '#070b18',
        }
      }
    },
  },
  plugins: [],
}
