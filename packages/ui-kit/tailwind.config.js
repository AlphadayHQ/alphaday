/** @type {import('tailwindcss').Config} */
import { alphadayColors } from "./src/globalStyles/colors";
import { deviceBreakpoints } from "./src/globalStyles/breakpoints";
import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: alphadayColors,
        screens: {
            ...deviceBreakpoints,
            tiny: { max: deviceBreakpoints.tiny }, // tailwind defaults to min-width. This means @media (max-width: tiny) { ... }
        },
    },
    plugins: [typography],
};
