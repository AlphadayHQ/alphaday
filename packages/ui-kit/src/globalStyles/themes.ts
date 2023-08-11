import { darkColors } from "./colors";

export const themes = {
    themes: [
        {
            name: "base",
            selectors: [":root"],
            theme: {
                colors: darkColors,
            },
        },
        // TODO: add another theme like so
        // {
        //   selectors: ['.dark'],
        //   theme: {
        //     colors: darkColors,
        //   },
        // },
    ],
};
