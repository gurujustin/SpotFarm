/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{html,js}",
    "./public/**/*.html",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    screens: {
      sm: "450px",
      md: "650px",
      mdxl: "900px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    backgroundColor: (theme) => ({
      primary: "#000000",
      secondary: "#ffed4a",
      danger: "#e3342f",
      ...theme("colors"),
    }),
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "2.5rem",
      "4xl": "3.441rem",
      "5xl": "5rem",
    },

    extend: {
      animation: {
        fadeIn: "fadeIn 3s ease-in forwards",
        fadeOut: "fadeIn 2s ease-in forwards",
        LinearAnimaion: " 3s linear infinite",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: " 3s linear infinite",
        fadeindown: "fadeindown 1s ease-out forwards",
        fadeinleft: "fadeinleft 1s ease-out forwards",
        fadeinright: "fadeinright 1s ease-out forwards",
        scaleintopleft: "scaleintopleft 1.5s ease-in-out forwards",
      },
      keyframes: {
        wiggle:  {
          "0%": {
            background:
              "linear-gradient(135deg, #696969 0%, #C2C2C2 0%, #757575 100%)",
          },
          "25%": {
            background:
              "linear-gradient(135deg, #696969 0%, #C2C2C2 25%, #757575 100%)",
          },
          "50%": {
            background:
              "linear-gradient(135deg, #696969 0%, #C2C2C2 50%, #757575 100%)",
          },
          "75%": {
            background:
              "linear-gradient(135deg, #696969 0%, #C2C2C2 75%, #757575 100%)",
          },
          "100%": {
            background:
              "linear-gradient(135deg, #696969 0%, #C2C2C2 100%, #757575 100%)",
          },
        },
      },
    },
  },
  variants: {
    animation: ["motion-safe"],
  },
  plugins: [
    require("tailwindcss-elevation")(["responsive"]),
    require("tw-elements/dist/plugin"),
    require("flowbite/plugin"),
    require("tailwind-clip-path"),
  ],
};
