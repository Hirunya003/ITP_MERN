/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green500: '#18A558',  // Darker green
        green300: '#A3EBB1',  // Lighter green
      },
    },
  },
  plugins: [],
};