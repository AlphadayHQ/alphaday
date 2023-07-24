/** @type {import('tailwindcss').Config} */
import { alphadayColors } from "./src/globalStyles/colors";
import typography from "@tailwindcss/typography";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: alphadayColors,
    },
    plugins: [typography],
};
