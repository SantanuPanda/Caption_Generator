/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'light': 'rgb(243, 244, 246)', // bg-gray-100
        'dark': 'rgb(17, 24, 39)',     // bg-gray-900
      },
    },
  },
  plugins: [],
}
