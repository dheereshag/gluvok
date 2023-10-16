/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        88: "22rem",
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      height: {
        88: "22rem",
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      fontSize: {
        "2xs": ["0.625rem", "0.75rem"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
