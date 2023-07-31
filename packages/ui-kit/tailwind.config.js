/** @type {import('tailwindcss').Config} */
import { colors } from "./src/globalStyles/colors";
import { tailwindBreakpoints } from "./src/globalStyles/breakpoints";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";
import { fontUtilities } from "./src/globalStyles/fontGroups";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: colors,

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
        plugin(function ({ addUtilities }) {
            addUtilities({
                ...fontUtilities,
            });
        }),
    ],
};
