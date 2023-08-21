import { DefaultTheme } from "styled-components";
import { classic, light, cool, dark } from "./colors";

declare module "styled-components" {
    export interface DefaultTheme {
        name: string;
        colors: {
            [x: string]: string;
        };
        fontGroup: {
            major: string;
            highlight: string;
            highlightSemi: string;
            normal: string;
            support: string;
            supportBold: string;
            mini: string;
        };
        fontSize: {
            body: string;
            h1: string[];
            h2: string[];
            h3: string[];
            h4: string[];
            h5: string[];
            h6: string[];
        };
        fonts: {
            body: string;
            heading: string;
            montserrat: string;
        };
        fontWeights: {
            body: number;
            heading: number;
        };
        lineHeights: {
            body: number;
            heading: number;
        };
        radii: {
            [x: string]: string;
        };
        shadows: {
            default: string;
            sm: string;
            lg: string;
        };
        breakpoints: string[];
        transition: string;
    }
}

const breakpoints = ["576px", "768px", "992px", "1200px", "1400px"];

const alphaFontGroups = {
    major: `font-size: 1.5rem; font-weight: 600; line-height: 1; letter-spacing: 0px;`,
    highlight: `font-size: 0.75rem; font-weight: 700; line-height: 1.5; letter-spacing: 0.5px;`,
    highlightSemi: `font-size: 0.75rem; font-weight: 600; line-height: 1.5; letter-spacing: 0.5px;`,
    normal: `font-size: 0.75rem; font-weight: 400; line-height: 1.5; letter-spacing: 0.2px;`,
    support: `font-size: 10px; font-weight: 400; line-height: 1.5; letter-spacing: 0.2px; text-transform: uppercase;`,
    supportBold: `font-size: 10px; font-weight: 600; line-height: 1.5; letter-spacing: 0.2px;`,
    mini: `font-size: 10px; font-weight: 400; line-height: 1.5; letter-spacing: 0.2px; text-transform: none;`,
};

const defaultThemeOpt = {
    fontSize: {
        body: "0.75rem",
        h1: ["2.1875rem", "2.1875rem", "2.1875rem", "2.1875rem"],
        h2: ["1.75rem", "1.75rem", "1.75rem"],
        h3: ["1.53125rem", "1.53125rem"],
        h4: ["1.3125rem", "1.3125rem"],
        h5: ["1.09375rem", "1.09375rem"],
        h6: ["0.875rem", "0.875rem"],
    },
    fontGroup: alphaFontGroups,
    fonts: {
        body: `'Open sans', sans-serif`,
        heading: `'Open Sans', sans-serif`,
        montserrat: `"Montserrat", "Helvetica Neue", Helvetica, Verdana`,
    },
    fontWeights: {
        body: 400,
        heading: 500,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25,
    },
    radii: {
        sm: "3px",
        md: "6px",
        lg: "8px",
        rounded: "4px",
        circle: "50%",
        pill: "500px",
    },
    shadows: {
        default: "0 0 12px 3px rgba(0, 0, 0, 0.06)",
        sm: "0px -1px 1px 0px rgba(0,0,0, .2)",
        lg: "0 1rem 3rem rgba(0, 0, 0, .175)",
        input: "0 0 0 0.2rem rgb(1 104 250 / 25%)",
    },
    breakpoints: [...breakpoints],
    transition: "all 0.4s ease 0s",
    anchor: {
        primary: {
            color: "white",
            bg: "red",
        },
    },
};

export const classicTheme: DefaultTheme = {
    name: "classic",
    colors: { ...classic },
    ...defaultThemeOpt,
};

export const lightTheme: DefaultTheme = {
    name: "light",
    colors: { ...light },
    ...defaultThemeOpt,
};

export const coolTheme: DefaultTheme = {
    name: "cool",
    colors: { ...cool },
    ...defaultThemeOpt,
};

export const darkTheme: DefaultTheme = {
    name: "dark",
    colors: { ...dark },
    ...defaultThemeOpt,
    fonts: {
        ...defaultThemeOpt.fonts,
        body: `'Open Sans', sans-serif`,
        heading: `'Open Sans', sans-serif`,
        montserrat: `"Montserrat", "Helvetica Neue", Helvetica, Verdana`,
    },
};
