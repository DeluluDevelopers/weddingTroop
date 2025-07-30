/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.8s ease-out",
        "slide-in-right": "slideInRight 0.8s ease-out",
        "spin-slow": "spin 4s linear infinite",
        "bounce-slow": "bounce 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "25%": {
            transform: "translateY(-8px) rotate(1deg)",
          },
          "50%": {
            transform: "translateY(-12px) rotate(0deg)",
          },
          "75%": {
            transform: "translateY(-8px) rotate(-1deg)",
          },
        },
        sparkle: {
          "0%, 100%": {
            opacity: "0.3",
            transform: "rotate(0deg) scale(1)",
          },
          "25%": {
            opacity: "0.8",
            transform: "rotate(90deg) scale(1.1)",
          },
          "50%": {
            opacity: "1",
            transform: "rotate(180deg) scale(1.2)",
          },
          "75%": {
            opacity: "0.8",
            transform: "rotate(270deg) scale(1.1)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
