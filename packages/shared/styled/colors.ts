import tinycolor from "tinycolor2";

const primary = "#0168fa";
const secondary = "#5f6d88";
const gray50 = "#fafbfc";
const gray100 = "#f4f5f8";
const gray200 = "#e3e7ed";
const gray300 = "#cdd4e0";
const gray400 = "#b4bdce";
const gray500 = "#97a3b9";
const gray600 = "#7987a1";
const gray700 = "#596882";
const gray800 = "#3b4863";
const gray900 = "#1c273c";
const gray950 = "#637388";

/**
 * new colors for Alphaday version 2.0 (dark)
 */

// these are mostly used as backgrounds
// (not really ordered)
const alphaDarkBase = "#111213"; // darkest bg used in the app
const alphaDark100 = "#191C1F";
const alphaDark200 = "#212328"; // moduleBG1
const alphaDark300 = "#1E2024"; // moduleBG2
const alphaDark400 = "#25272C"; // moduleBG3
const alphaDark500 = "#2E3037"; // moduleBG4
const alphaDark600 = "#27292F"; // panelBG
const alphaDark700 = "#15161A"; // tab switcher bg
const alphaDark800 = "#0A0A0B"; // search bar bg
const alphaDark900 = "#23242a"; // active/filled state
const alphaDark1000 = "#222529"; // button bg primary
const alphaDark1100 = "#393C46";
const alphaDark1600 = "#17191C"; // btn focus bg
const alphaDark1900 = "#2e3238"; // tab small bg
const alphaDark2000 = "#202127"; // tab small hover bg
const alphaDark2100 = "#0E0E11"; // tab small focus bg
const alphaDark2200 = "#090A0B"; // tab switcher focus bg
const alphaDark2300 = "#2c2e35"; // card selector bg
const alphaDark2400 = "#383a43"; // card selector bg:hover
const alphaDark2500 = "#25272d"; // card selector bg:active
const alphaDark2600 = "rgba(58, 63, 70, 0.15)"; // placeholder bg:hover
const alphaDark2700 = "rgba(12, 13, 14, 0.15)"; // placeholder bg:active

// small
const alphaDark1200 = "#1E2124"; // button bg
const alphaDark1400 = "#2A2D32"; // button bg hover
const alphaDark1700 = "#121416";

// extra small
const alphaDark1300 = "#1C1E21"; // button bg
const alphaDark1500 = "#2A2D32"; // button bg hover
const alphaDark1800 = "#151719";
const alphaFilteredWhite = "#27292E"; // "rgba(255, 255, 255, 0.2)";
const alphaFilteredLightGrey = "rgba(121, 131, 162, 0.2)";

// primary
const alphaLight = "#C2C5D6";
const alphaLightFiltered = "rgba(194, 197, 214, 0.2)";
const alphaLight100 = "#D1D4E0";
const alphaLight200 = "#ABADBA";
const alphaLight300 = "#E2E2EE";
const alphaDarkGrey = "#767C8F";
const alphaDarkGrey100 = "#84899A"; // info button hover
const alphaDarkGrey200 = "#5E6373"; // info button disabled
const alphaDarkGrey300 = "#656A7B"; // close button disabled
const alphaDarkGreyFiltered = "rgba(118, 124, 143, 0.2)";
const alphaDarkGreyFiltered2 = "rgba(34, 37, 41, 0.2)"; // close button withBg disabled
const alphaDarkerGrey = "#505562";
const alphaLightBlue = "#477FF7"; // action
const alphaLightBlue100 = "#5E8FF8"; // hover checkbox
const alphaDarkBlue = "#263964"; // primary/action dimmed
const alphaDarkBlue100 = "#2D4476"; // primary/action dimmed hover
const alphaDarkBlue200 = "#2c2e35"; // module Preview bg
const alphaDarkBlue300 = "#272a30"; // tooltip
const alphaDarkFiltered = "rgba(0, 0, 0, 0.8)"; // modal overlay
const alphaDarkFiltered100 = "rgba(0, 0, 0, 0.2)"; // modal overlay
const alphaDarkFiltered200 = "rgba(0, 0, 0, 0.4)"; // tutorial overlay
const alphaDarkFiltered300 = "rgba(0, 0, 0, 0.6)"; // dialog overlay
// const alphaDarkBlueFiltered = "rgba(150, 157, 182, 0.2)"; // ring of close button with bg

// secondary
const alphaRed = "#f45532";
const alphaRedFiltered = "rgba(255, 95, 88, 0.08)";
const alphaGreen = "#6DD230";
const alphaGreenFiltered = "rgba(109, 210, 48, 0.08";
const alphaOrange = "#FAA202";
const alphaOrangeFiltered = "rgba(250, 162, 2, 0.9)";
const alphaOrange50 = "#e1b74F";
const alphaOrange100 = "#BA7A02";
const alphaRoseBrown = "#C59592";
const alphaYellowGreen = "#b9e187";
const alphaOrangeSoda = "#f45532";

const darklighten5 = tinycolor(gray900).lighten(5).toString();
const darklighten2 = tinycolor(gray900).lighten(2).toString();
const darklighten8 = tinycolor(gray900).lighten(8).toString();
const darklighten3 = tinycolor(gray900).lighten(3).toString();
const darkdarken2 = tinycolor(gray900).darken(2).toString();
const darkdarken3 = tinycolor(gray900).darken(3).toString();
const darkdarken5 = tinycolor(gray900).darken(5).toString();

const alphadayCustomColors = {
    primary: alphaLight, // primary light
    primaryVariant100: alphaDarkGrey, // primary dark grey
    primaryVariant200: alphaDarkerGrey, // primary darker grey
    primaryVariant300: alphaDarkGreyFiltered, // primary dark grey opacity 0.2
    primaryVariant400: alphaLight100, // hover checkbox
    primaryVariant500: alphaLight200, // active checkbox
    primaryVariant600: alphaLightFiltered, // active Light
    primaryVariant700: alphaLight300, // close button tooltip
    primaryVariant800: alphaDarkGrey100, // info button hover
    primaryVariant900: alphaDarkGrey200, // info button disabled
    primaryVariant1000: alphaDarkGrey300, // close button disabled
    primaryVariant1100: alphaDarkGreyFiltered2, // close with bg button disabled opacity 0.2
    background: alphaDarkBase,
    backgroundVariant100: alphaDark100,
    backgroundVariant200: alphaDark200,
    backgroundVariant300: alphaFilteredWhite, // module header
    backgroundVariant400: alphaDark800, // search bg focus
    backgroundVariant500: alphaDarkBlue200, // module preview bg
    backgroundVariant600: alphaDark2600, // btn bg:active
    backgroundVariant700: alphaDark2700, // card selector bg:active
    backgroundVariant800: alphaDark300, // card bg
    backgroundVariant900: alphaDark600, // card bg:hover
    backgroundVariant1000: alphaDark900, // card bg:active
    backgroundVariant1100: alphaDarkBlue300, // tooltip
    backgroundVariant1200: alphaDarkFiltered, // modal overlay
    backgroundVariant1300: alphaDarkFiltered100, // modal overlay
    backgroundVariant1400: alphaDarkFiltered200, // tutorial overlay
    backgroundVariant1500: alphaDark400, // calendar events
    backgroundVariant1600: alphaDarkFiltered300, // dialog overlay
    btnBackgroundVariant100: alphaDark1000, // button bg primary
    btnBackgroundVariant200: alphaDark1200, // button bg small
    btnBackgroundVariant300: alphaDark1300, // button bg extra small & pry btn focus
    btnBackgroundVariant400: alphaDark500, // button hover
    btnBackgroundVariant500: alphaDark1400, // button hover small
    btnBackgroundVariant600: alphaDark1500, // button hover extra small
    btnBackgroundVariant700: alphaDark1600, // button hover extra small
    btnBackgroundVariant800: alphaDark1700, // button focus small
    btnBackgroundVariant900: alphaDark1800, // button focus extra small
    btnBackgroundVariant1000: alphaDark1900, // tab button small
    btnBackgroundVariant1100: alphaDark700, // tab button small
    btnBackgroundVariant1200: alphaDark2000, // tab button small hover
    btnBackgroundVariant1300: alphaDark2100, // tab button small focus
    btnBackgroundVariant1400: alphaDarkBlue, // open module tab
    btnBackgroundVariant1500: alphaDarkBlue100, // open module tab hover
    btnBackgroundVariant1600: alphaDark2200, // tab switcher focus bg
    btnBackgroundVariant1700: alphaDark2300, // card selector bg
    btnBackgroundVariant1800: alphaDark2400, // card selector bg:hover
    btnBackgroundVariant1900: alphaDark2500, // card selector bg:active

    btnRingVariant100: alphaLightBlue, // button Ring Primary
    btnRingVariant200: alphaDarkBlue, // button Ring PrimaryXL
    btnRingVariant300: alphaFilteredLightGrey, // button Ring SecodaryXL
    btnRingVariant400: alphaLightBlue100, // button Ring Primary
    btnRingVariant500: alphaDark1100, // button btn Ring

    secondaryOrange: alphaOrange, // calendar event category
    secondaryOrange50: alphaOrange50,
    secondaryOrange100: alphaOrange100,
    secondaryOrangeFiltered: alphaOrangeFiltered,
    secondaryRoseBrown: alphaRoseBrown, // calendar event weekend
    secondaryOrangeSoda: alphaOrangeSoda, // downward market
    secondaryYellowGreen: alphaYellowGreen, // upward market
};
export const classic = {
    //
    // Alphaday Custom Colors
    //
    ...alphadayCustomColors,
    //
    // Alphaday Custom Colors
    //

    // Classic Theme Colors
    // primary, // TODO: renable after removing legacy colors
    secondary,
    success: "#10b759",
    info: "#00b8d4",
    warning: "#ffc107",
    danger: "#f45532",
    light: "#e5e9f2",
    dark: "#3b4863",
    text: "#001737",
    text2: "#1b2e4b",
    text3: "#8392a5",
    text4: "#c0ccda",
    heading: "#001737",
    link: "#001737",
    background: "#ffffff",
    hover: primary,
    white: "#ffffff",
    black: "#000000",
    close: "#1b2e4b",
    border: "#485e9029",
    thinborder: "rgba(143 ,90, 71, 0.16)",
    gray50,
    gray100,
    gray200,
    gray300,
    gray400,
    gray500,
    gray600,
    gray700,
    gray800,
    gray900,
    gray950,
    whisper: "#f5f6fa",
    malibu: "#69b2f8",
    tropical: "#d1e6fa",
    pink: "#f10075",
    bayoux: "#49597b",
    athens: "#e9ecf1",
    athens2: "#eeeff4",
    athens3: "#f3f4f7",
    orange: "#fd7e14",
    cyan: "#17a2b8",
    teal: "#00cccc",
    indigo: "#5b47fb",
    vulcan: "#0f1520",
    litecoin: "#325a98",
    lightblue: "#a5d7fd",
    brand2: "#042893",
    shuttle: "#5c6c7f",
    science: "#063cdd",
    facebook: "#4064ac",
    twitter: "#00a7e6",
    shuttle2: "#566476",
    lilac: "#f8f9fc",
    catskill: "#eef0f7",
    gulf: "#031a61",
    river: "#475362",
    zircon: "#f3f8ff",
    clay: "#283143",
    clay2: "#232b3b",
    shaft: "#292929",
    cod: "#111111",
    silver: "#cdcdcd",
    //
    // Alphaday Custom Colors
    //
    // primary: ,
    primaryVariant100: "#00aeef", // primary dark grey
    // background:
    backgroundVariant100: "#ffffff",
    backgroundVariant200: "#ffffff",
    backgroundVariant300: "#ffffff",
    btnRingVariant300: "#485e9029",
    btnRingVariant500: "#485e9029",
};

const lightBg = "#f5f6fa";

export const light = {
    //
    // Alphaday Custom Colors
    //
    ...alphadayCustomColors,
    //
    // Alphaday Custom Colors
    //

    // Light theme Colors
    primary,
    secondary,
    success: "#10b759",
    info: "#00b8d4",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#e5e9f2",
    dark: "#3b4863",
    text: "#001737",
    text2: "#1b2e4b",
    text3: "#8392a5",
    text4: "#c0ccda",
    heading: "#001737",
    link: "#001737",
    background: lightBg,
    hover: primary,
    white: "#ffffff",
    black: "#000000",
    close: "#1b2e4b",
    border: "#485e9029",
    thinborder: "rgba(143 ,90, 71, 0.16)",
    gray50: "#fafbfc",
    gray100: "#f4f5f8",
    gray200: "#e3e7ed",
    gray300: "#cdd4e0",
    gray400: "#b4bdce",
    gray500: "#97a3b9",
    gray600: "#7987a1",
    gray700: "#596882",
    gray800: "#3b4863",
    gray900: "#1c273c",
    gray950: "#637388",
    whisper: "#f5f6fa",
    malibu: "#69b2f8",
    tropical: "#d1e6fa",
    pink: "#f10075",
    bayoux: "#49597b",
    athens: "#e9ecf1",
    athens2: "#eeeff4",
    athens3: "#f3f4f7",
    orange: "#fd7e14",
    cyan: "#17a2b8",
    teal: "#00cccc",
    indigo: "#5b47fb",
    vulcan: "#0f1520",
    litecoin: "#325a98",
    lightblue: "#a5d7fd",
    brand2: "#042893",
    shuttle: "#5c6c7f",
    science: "#063cdd",
    facebook: "#4064ac",
    twitter: "#00a7e6",
    shuttle2: "#566476",
    lilac: "#f8f9fc",
    catskill: "#eef0f7",
    gulf: "#031a61",
    cornflower: "#525f70",
    river: "#475362",
    zircon: "#f3f8ff",
    clay: "#283143",
    clay2: "#232b3b",
    shaft: "#292929",
    cod: "#111111",
    silver: "#cdcdcd",
    //
    // Alphaday Custom Colors
    //
    // primary: ,
    primaryVariant100: "#00aeef", // primary dark grey
    // background:
    backgroundVariant100: lightBg,
    backgroundVariant200: lightBg,
    backgroundVariant300: lightBg,
    btnRingVariant300: "#485e9029",
    btnRingVariant500: "#485e9029",
};

const skinUi01 = tinycolor(primary).desaturate(20).toHexString();
const coolBg = tinycolor(skinUi01).setAlpha(0.03).toRgbString();
const coolBorder = tinycolor(skinUi01).lighten(46).toRgbString();

export const cool = {
    //
    // Alphaday Custom Colors
    //
    ...alphadayCustomColors,
    //
    // Alphaday Custom Colors
    //

    // Cool theme Colors
    // primary, // TODO: renable after removing legacy colors
    secondary,
    success: "#10b759",
    info: "#00b8d4",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#e5e9f2",
    dark: "#3b4863",
    text: "#001737",
    text2: "#1b2e4b",
    text3: "#8392a5",
    text4: "#c0ccda",
    heading: "#001737",
    link: "#001737",
    background: coolBg,
    hover: primary,
    white: "#ffffff",
    black: "#000000",
    close: "#1b2e4b",
    border: coolBorder,
    thinborder: "rgba(143 ,90, 71, 0.16)",
    gray50,
    // gray100, // TODO: renable after removing legacy colors
    gray200,
    gray300,
    gray400,
    gray500,
    gray600,
    gray700,
    gray800,
    gray900,
    gray950,
    whisper: "#f5f6fa",
    malibu: "#69b2f8",
    tropical: "#d1e6fa",
    pink: "#f10075",
    bayoux: "#49597b",
    athens: "#e9ecf1",
    athens2: "#eeeff4",
    athens3: "#f3f4f7",
    orange: "#fd7e14",
    cyan: "#17a2b8",
    teal: "#00cccc",
    indigo: "#5b47fb",
    vulcan: "#0f1520",
    litecoin: "#325a98",
    lightblue: "#a5d7fd",
    brand2: "#042893",
    shuttle: "#5c6c7f",
    science: "#063cdd",
    facebook: "#4064ac",
    twitter: "#00a7e6",
    shuttle2: "#566476",
    lilac: "#f8f9fc",
    catskill: "#eef0f7",
    gulf: "#031a61",
    cornflower: "#525f70",
    river: "#475362",
    zircon: "#f3f8ff",
    clay: "#283143",
    clay2: "#232b3b",
    shaft: "#292929",
    cod: "#111111",
    silver: "#cdcdcd",
    skinUi01,
    //
    // legacy colors TODO: remove
    //
    white100: "rgb(245, 245, 250)", // main calendar 5% tint of white
    gray: "red", // cant find this
    gray100: "rgb(239, 239, 239)", // dropdown item hover
    brown100: "rgba(143 ,90, 71, 0.16)", // border
    brown150: "rgba(143 ,90, 71, 0.16)", // border (seperation due to darkmode for table)
    brown200: "#3D1D00", // icons, text #000 looks better though
    brown300: "rgb(55, 26, 0)", // lighter text/placeholder
    silver500: "#cfcbc9", // background of user
    silver600: "#BCB7B3",
    primary: "#16b8d4",
    primary200: "#00aeef",
    //
    // Alphaday Custom Colors
    //
    // primary: ,
    primaryVariant100: "#00aeef", // primary dark grey
    // background:
    backgroundVariant100: coolBg,
    backgroundVariant200: coolBg,
    backgroundVariant300: coolBg,
    btnRingVariant300: coolBorder,
    btnRingVariant500: coolBorder,
};

export const dark = {
    //
    // Alphaday Custom Colors
    //
    ...alphadayCustomColors,
    //
    // Alphaday Custom Colors
    //

    // Dark theme Colors
    secondary,
    success: alphaGreen,
    successFiltered: alphaGreenFiltered,
    info: "#00b8d4",
    warning: "#ffc107",
    danger: alphaRed,
    dangerFiltered: alphaRedFiltered,
    light: "#e5e9f2",
    dark: "#3b4863",
    text: "#ffffff",
    text2: gray300,
    text3: "#8392a5",
    text4: tinycolor(gray700).setAlpha(0.7).toRgbString(),
    heading: "#ffffff",
    link: "#ffffff",
    hover: primary,
    white: "#ffffff",
    black: "#000000",
    close: gray300,
    border: "#485e9029",
    thinborder: "rgba(136, 114, 105, 0.5)",
    heather: "#c0ccda",
    gray50,
    // gray100, // TODO: renable after removing legacy colors
    gray200,
    gray300,
    gray400,
    gray500,
    gray600,
    gray700,
    gray800,
    gray900,
    gray950,
    whisper: "#f5f6fa",
    malibu: "#69b2f8",
    tropical: "#d1e6fa",
    pink: "#f10075",
    bayoux: "#49597b",
    athens: "#e9ecf1",
    athens2: "#eeeff4",
    athens3: "#f3f4f7",
    orange: "#fd7e14",
    cyan: "#17a2b8",
    teal: "#00cccc",
    indigo: "#5b47fb",
    vulcan: "#0f1520",
    litecoin: "#325a98",
    lightblue: "#a5d7fd",
    brand2: "#042893",
    shuttle: "#5c6c7f",
    science: "#063cdd",
    facebook: "#4064ac",
    twitter: "#00a7e6",
    shuttle2: "#566476",
    lilac: "#f8f9fc",
    catskill: "#eef0f7",
    gulf: "#031a61",
    cornflower: "#525f70",
    river: "#475362",
    zircon: "#f3f8ff",
    clay: "#283143",
    clay2: "#232b3b",
    shaft: "#292929",
    cod: "#111111",
    silver: "#cdcdcd",
    darklighten5,
    darklighten2,
    darklighten8,
    darklighten3,
    darkdarken2,
    darkdarken3,
    darkdarken5,
};
