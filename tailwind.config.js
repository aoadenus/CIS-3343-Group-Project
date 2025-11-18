/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raspberry: '#C44569',
        cream: {
          DEFAULT: '#F8EBD7',
          dark: '#3A3A3A',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
          light: '#404040',
        },
        chocolate: {
          DEFAULT: '#5A3825',
          light: '#7A5845',
        },
        'soft-gray': '#E9E9E9',
        primary: {
          DEFAULT: '#C44569',
          light: '#E36B86',
          dark: '#A33857',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
