import * as React from "react";
import { addDecorator } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import { ThemeProvider, theme } from "@alphaday/shared/styled";
import { ResetCSS } from "./reset";

addDecorator(StoryRouter());

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <ResetCSS />
      <div className="story-wrap">
        <Story />
      </div>
    </ThemeProvider>
  ),
];

const customViewports = {
  extraLargeDevices: {
    name: "Extra Large Devices",
    styles: {
      width: "1200px",
      height: "1024px",
    },
  },
  largeDevices: {
    name: "Large Devices",
    styles: {
      width: "992px",
      height: "1024px",
    },
  },
  mediumDevices: {
    name: "Medium Devices",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },
  smallDevices: {
    name: "Small devices",
    styles: {
      width: "576px",
      height: "720px",
    },
  },
  extraSmallDevices: {
    name: "Extra Small devices",
    styles: {
      width: "360px",
      height: "640px",
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: { viewports: customViewports },
  // Storybook a11y addon configuration
  a11y: {
    // the target DOM element
    element: "#root",
    // sets the execution mode for the addon
    manual: false,
  },
};
