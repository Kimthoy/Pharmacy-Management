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
      keyframes: {
        "color-cycle": {
          "0%": { color: "#6366F1" }, // indigo-500
          "25%": { color: "#EC4899" }, // pink-500
          "50%": { color: "#F59E0B" }, // amber-500
          "75%": { color: "#10B981" }, // emerald-500
          "100%": { color: "#6366F1" }, // indigo-500
        },
       
      },
      animation: {
        "color-cycle": "color-cycle 3s ease-in-out infinite",
       
      },
    },
  },
  plugins: [],
};
