module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        samsung: "360px",
        iphone: "430px",
        ipad: "1024px",
        tablet: "1280px",
        computer: "1536px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        khmer: ["Kantumruy", "Nokora", "Moul", "serif"], // Add your Khmer fonts
      },
    },
  },
  plugins: [],
};
