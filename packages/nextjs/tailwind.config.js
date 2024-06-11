/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FFAA00", // orange
          "primary-content": "#030712", //grey 950
          secondary: "#F10849", // red-pinkish
          "secondary-content": "#030712", //grey 950
          accent: "#FFAA00", //orange
          "accent-content": "#030712", //grey 950
          neutral: "#4b5563", // grey 600
          "neutral-content": "#ffffff", //white
          "base-100": "#efefef", // less less white
          "base-200": "#f9fafb", // less white
          "base-300": "#ffffff", // white
          "base-content": "#000000", //black
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#FFAA00", // orange
          "primary-content": "#f9fafb", //grey 50
          secondary: "#F10849", // red-pinkish
          "secondary-content": "#f9fafb", //grey 50
          accent: "#4969A6", // orange
          "accent-content": "#f9fafb", //grey 50
          neutral: "#F9FBFF", // grey 600
          "neutral-content": "#000000", //black
          "base-100": "#3e3e3e", //less less back
          "base-200": "#0D0D0D", //less black
          "base-300": "#000000", //black
          "base-content": "#ffffff", //white
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontFamily: {
        body: ["Haas", "sans-serif"],
      },
    },
  },
};
