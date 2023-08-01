/** @type {import('tailwindcss').Config} */
import { alphadayColors } from "./src/globalStyles/colors";
import { breakpoints, tailwindBreakpoints } from "./src/globalStyles/breakpoints";
import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: alphadayColors,

        screens: {
            ...tailwindBreakpoints,
            tiny: { max: tailwindBreakpoints.tiny }, // tailwind defaults to min-width. This means @media (max-width: tiny) { ... }
        },
        fontFamily: {
            sans: '"Open sans", sans-serif',
            montserrat: '"Montserrat", "Helvetica Neue", Helvetica, Verdana',
        },
    },
    plugins: [typography],
};
