/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          dark: '#0f172a',
          purple: '#6d28d9',
          lightPurple: '#f5f3ff',
        }
      }
    },
  },
  plugins: [],
}
