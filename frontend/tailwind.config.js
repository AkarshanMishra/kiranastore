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
          green: '#0c831f', // Zepto / Blinkit signature vibrant green
          lightGreen: '#eef8f1',
          yellow: '#f7c325',
          dark: '#1c1c1c'
        }
      }
    },
  },
  plugins: [],
}
