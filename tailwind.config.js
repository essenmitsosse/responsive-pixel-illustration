module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
