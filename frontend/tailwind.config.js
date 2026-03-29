/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uefa-dark': '#001240',
        'uefa-blue': '#0033A0',
        'uefa-light-blue': '#0057B8',
        'uefa-gold': '#FFD700',
        'uefa-silver': '#A0AEC0',
        'uefa-background': '#000B1E',
        'ucl-navy': '#00072D',
      },
      boxShadow: {
        'uefa-sm': '0 2px 8px rgba(255, 215, 0, 0.1)',
        'uefa-md': '0 4px 16px rgba(255, 215, 0, 0.2)',
        'uefa-lg': '0 8px 32px rgba(255, 215, 0, 0.3)',
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
