/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        lightgray: "#282828",
        text: "#FFFFFF",
        customgray: "#a7a7a7",
        searchColor: "#242424",
      },
    },
  },
  plugins: [],
};
