/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#e5e5e5'
        }
      }
    },
  },
  plugins: [],
}
