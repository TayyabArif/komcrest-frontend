/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        tilda: ['"TildaSans"', 'sans-serif'],
      },
      colors: {
        primary: "#2457d7",
        secondry: "#78206e",
        adminPrimary: "#1c2435",
        "btn-primary": "#2457d7"
      },
      // fontFamily: {
      //   sans: ['Aptos', 'ui-sans-serif', 'system-ui'],
      // },
    },
  },
  plugins: [nextui()],
  
};
