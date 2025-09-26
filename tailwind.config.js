/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.js",
    "./**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'custom-bg': 'var(--bg)',
        'custom-card': 'var(--card)',
      }
    },
  },
  plugins: [],
}