/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'fixed': '1440px',
      },
      maxWidth: {
        'app': '1440px',
      },
      maxHeight: {
        'app': '1080px',
      }
    },
  },
  plugins: [],
} 
