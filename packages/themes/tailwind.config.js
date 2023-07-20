/** @type {import('tailwindcss').Config} */
import { alphadayColors } from "./src/globalStyles/colors";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: alphadayColors,
  },
  plugins: [],
};
