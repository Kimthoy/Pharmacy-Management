module.exports = {
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
        // Add other custom fonts here
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        khmer: ["Nokora", "Kantumruy", "serif"],
      },
    },
  },
  plugins: [],
};
