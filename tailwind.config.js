/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "sprinklr-green": "#71C057",
      "sprinklr-red": "#E1251B",
      "sprinklr-yellow": "#FFCD2D",
      "sprinklr-blue": "#28AAE1",
      "sprinklr-gray": "#3D454F",
      "white": "#FFFFFF",
      "sprinklr-dark-blue": "#185AD2",
    },
  },

  plugins: [],
};
