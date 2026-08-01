/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0a0a0b",
        carbon: "#141416",
        carbon2: "#1c1c1f",
        steel: "#38383e",
        cream: "#f2f1ee",
        creamDim: "#a8a7a3",
        gold: "#c6a15b",
        goldBright: "#e0c07e",
        red: "#c8102e",
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
