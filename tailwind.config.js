/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          dark: '#0f172a',
          light: '#2563eb',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
          light: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
