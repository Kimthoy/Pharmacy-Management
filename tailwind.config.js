// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        kantumruy: ["Kantumruy", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        nokora: ["Nokora", "serif"],
        notosans: ["Noto Sans", "sans-serif"],
        notoserifkhmer: ["Noto Serif Khmer", "serif"],
        opensans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      keyframes: {
        "slide-in-left": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-bottom": "slide-in-bottom 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
