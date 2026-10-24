/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: '#6F315F',
        'plum-dark': '#57254B',
        rose: '#D95C91',
        'rose-dark': '#C04A80',
        blush: '#F7E8F0',
        offwhite: '#FBF8FB',
        charcoal: '#2D2630',
        mint: '#E6F4ED',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
