/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryText: "#33383C",
        brightBrick: "#F7542E",
        lightBlue: "#D1EFED",
        lightPurple: "#BC72FE",
        fadedBrick: "#F87D61",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
