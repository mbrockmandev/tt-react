/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    fontFamily: {
      sans: ["-apple-system", "BlinkMacSystemFont"],
      serif: ["Charter", "Cambria", "Georgia"],
      mono: ["SFMono-Regular", "Menlo"],
      display: ["Oswald"],
      body: ["Open Sans"],
    },
    extend: {
      placeholder: ["focus"],
      backgroundColor: ["hover"],
      gradientColorStops: ["hover"],
      backgroundClip: ["hover"],
      textShadow: {
        default: "0 2px 5px rgba(0, 0, 0, 0.2)",
        lg: "0 2px 10px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".background-clip-text": {
          backgroundClip: "text",
          "-webkit-background-clip": "text",
        },
        ".shimmer-text": {
          backgroundSize: "200% 100%",
          animation: "shineLtr 3s infinite linear",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
