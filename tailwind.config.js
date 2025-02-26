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
          purple: "#8C52FF",
          green: "#10D47F"
        },
        secondary: {
          purple: "#DECDFF"
        }
      },
      fontFamily: {
        inter: ['"Inter"', 'serif']
      }
    },
  },
  plugins: [],
}

