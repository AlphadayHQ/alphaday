import styled, {
    createGlobalStyle,
    css,
    keyframes,
    ThemeProvider,
    DefaultTheme,
} from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import tinycolor from "tinycolor2";
import { Container, Row, Col } from "styled-bootstrap-grid";
import { classicTheme, lightTheme, coolTheme, darkTheme } from "./theme";

// TODO remove this after migrating to all components to alphaBreakpoints
export const breakpoints = [400, 576, 768, 992, 1200, 1400];

export const alphaBreakpoints = {
    minWidgetWidth: 320,
    maxWidgetWidth: 650,
    SingleColMinWidth: 350,
    TwoColMinWidth: 750, // Also max width for 1-col
    ThreeColMinWidth: 1200, // Also max width for 2-col
    FourColMinWidth: 1921, // Also max width for 3-col
    FourColMaxWidth: 2725,
};

export const alphaDevice = {
    SingleCol: `@media screen and (min-width: ${alphaBreakpoints.SingleColMinWidth}px)`,
    TwoCol: `@media screen and (min-width: ${alphaBreakpoints.TwoColMinWidth}px)`,
    ThreeCol: `@media screen and (min-width: ${alphaBreakpoints.ThreeColMinWidth}px)`,
    fourCol: `@media screen and (min-width: ${alphaBreakpoints.FourColMinWidth}px)`,
};

export const device = {
    tiny: `@media (max-width: ${breakpoints[0]}px)`,
    small: `@media screen and (min-width: ${breakpoints[1]}px)`,
    medium: `@media screen and (min-width: ${breakpoints[2]}px)`,
    large: `@media screen and (min-width: ${breakpoints[3]}px)`,
    xlarge: `@media screen and (min-width: ${breakpoints[4]}px)`,
    xxlarge: `@media screen and (min-width: ${breakpoints[5]}px)`,
    mdToLg: `@media (min-width: 768px) and (max-width: 991px)`,
    lgToXl: `@media (min-width: 992px) and (max-width: 1199px)`,
};

const themes: { [x: string]: DefaultTheme } = {
    classic: classicTheme,
    light: lightTheme,
    cool: coolTheme,
    dark: darkTheme,
};

export {
    createGlobalStyle,
    css,
    keyframes,
    ThemeProvider,
    themeGet,
    classicTheme,
    darkTheme,
    tinycolor,
    Container,
    Row,
    Col,
    themes,
};
export * from "styled-system";
export default styled;
