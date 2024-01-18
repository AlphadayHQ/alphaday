/** @type {import('tailwindcss').Config} */
import { themes } from "./src/globalStyles/themes";
import { tailwindBreakpoints } from "./src/globalStyles/breakpoints";
import typography from "@tailwindcss/typography";

import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";
import themeSwapper from "tailwindcss-theme-swapper";
import tailwindScrollbar from "tailwind-scrollbar";
import { fontUtilities } from "./src/globalStyles/fontGroups";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
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
        forms,
        themeSwapper({ themes }),
        plugin(function ({ addUtilities }) {
            addUtilities({
                ...fontUtilities,
            });
        }),
        tailwindScrollbar({ nocompatible: true }),
    ],
};
