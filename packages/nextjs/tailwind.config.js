/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["cupcake"],
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["forest"],
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: { "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
    },
  },
};
