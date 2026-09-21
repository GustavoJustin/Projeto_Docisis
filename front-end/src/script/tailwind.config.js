/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.js",
    "./**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF8F3",
        cocoa: {
          50: "#FBF8F3",
          100: "#EDE3D6",
          200: "#D8CCB8",
          300: "#B5A891",
          400: "#9C8D78",
          500: "#8B5E34",
          600: "#754D29",
          700: "#5C3D22",
          800: "#3A2A1A",
          900: "#2B2118",
        },
        blush: {
          200: "#F7D9DF",
          300: "#F2C7D0",
          500: "#C97A8E",
          800: "#8B4A5C",
        },
      },
    },
  },
  plugins: [],
};
