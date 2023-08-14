/** @type {import('tailwindcss').Config} */
import { darkColors } from "./src/globalStyles/colors";
import { tailwindBreakpoints } from "./src/globalStyles/breakpoints";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";
// import createThemes from "tw-colors";
import { fontUtilities } from "./src/globalStyles/fontGroups";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: darkColors,
        screens: {
            ...tailwindBreakpoints,
            tiny: { max: tailwindBreakpoints.tiny }, // tailwind defaults to min-width. This means @media (max-width: tiny) { ... }
        },
        fontFamily: {
            sans: '"Open sans", sans-serif',
            montserrat: '"Montserrat", "Helvetica Neue", Helvetica, Verdana',
        },
        fontFamily: {
            sans: '"Open sans", sans-serif',
            montserrat: '"Montserrat", "Helvetica Neue", Helvetica, Verdana',
        },
    },
    plugins: [
        typography,
        // createThemes({
        //     dark: darkColors,
        //     // Add themes here like light: LightColors
        // }),
        plugin(function ({ addUtilities }) {
            addUtilities({
                ...fontUtilities,
            });
        }),
    ],
};
