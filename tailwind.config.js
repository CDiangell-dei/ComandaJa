/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // warm golden pastel amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        pastel: {
          red: '#e11d48',
          yellow: '#facc15',
          crust: '#ea580c',
          green: '#16a34a'
        }
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
