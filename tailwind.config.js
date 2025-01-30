/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        parsley: ['Parsley', 'Sans-serif'], // Agrega la fuente
      }
    },
  },
  plugins: [],
}

