/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Roboto', 'sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9f3',
          100: '#dbf1e3',
          200: '#bae2cb',
          300: '#8eccae',
          400: '#5caf8c',
          500: '#389370',
          600: '#267659',
          700: '#1d5e46',
          800: '#174b38',
          900: '#064C23',
          950: '#032b14',
          DEFAULT: '#064C23',
        },
        secondary: {
          50: '#fdf6f4',
          100: '#faebe7',
          200: '#f5d5cc',
          300: '#ebb3a3',
          400: '#dc8770',
          500: '#cb664b',
          600: '#b75239',
          700: '#A44F37',
          800: '#7e3b29',
          900: '#683424',
          950: '#381810',
          DEFAULT: '#A44F37',
        },
        brand: {
          primary: '#064C23',
          secondary: '#A44F37',
        },
      }
    },
  },
  plugins: [],
}
