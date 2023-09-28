import { darkColors } from "./colors";

export const themes = [
    {
        name: "base",
        selectors: [":root"],
        theme: {
            colors: darkColors,
        },
    },
    // TODO (xavier-charles): add another theme like so
    // {
    //   selectors: ['.dark'],
    //   theme: {
    //     colors: darkColors,
    //   },
    // },
];

// TODO (xavier-charles): setup theme switching and selection
export const selectedTheme = "base";
export const themeColors =
    themes.find((theme) => theme.name === selectedTheme)?.theme.colors ||
    themes[0].theme.colors;
