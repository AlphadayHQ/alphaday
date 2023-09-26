export const breakpoints = {
    minWidgetWidth: 320,
    tiny: 400, // targets only small mobile screens with width < 400px
    maxWidgetWidth: 650,
    SingleColMinWidth: 350,
    TwoColMinWidth: 750, // Also max width for 1-col
    ThreeColMinWidth: 1200, // Also max width for 2-col
    FourColMinWidth: 1921, // Also max width for 3-col
    FourColMaxWidth: 2725,
};

export const deviceBreakpoints = {
    tiny: breakpoints.tiny,
    singleCol: breakpoints.SingleColMinWidth,
    twoCol: breakpoints.TwoColMinWidth,
    threeCol: breakpoints.ThreeColMinWidth,
    fourCol: breakpoints.FourColMinWidth,
};

export const tailwindBreakpoints = {
    tiny: breakpoints.tiny,
    "single-col": `${breakpoints.SingleColMinWidth}px`,
    "two-col": `${breakpoints.TwoColMinWidth}px`,
    "three-col": `${breakpoints.ThreeColMinWidth}px`,
    "four-col": `${breakpoints.FourColMinWidth}px`,
};
