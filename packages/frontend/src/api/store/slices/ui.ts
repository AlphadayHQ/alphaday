import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ECookieChoice, TTutorialTip } from "src/api/types";

export type TTheme = "dark";
export interface ITutorialState {
    showTutorial: boolean | undefined;
    currentTutorialTip: TTutorialTip | undefined;
}
export interface IUIState {
    theme: TTheme;
    showWidgetLib: boolean;
    showBalance: boolean;
    tutorial: ITutorialState;
    cookieChoice: ECookieChoice | undefined;
    mobile: {
        widgetsNavOpen: boolean;
        selectedMobileSortOrder: number;
    };
    acceptedSwapToS: boolean | undefined;
}

const initialState: IUIState = {
    theme: "dark",
    showWidgetLib: false,
    showBalance: true,
    tutorial: { showTutorial: undefined, currentTutorialTip: undefined },
    cookieChoice: undefined,
    mobile: {
        widgetsNavOpen: false,
        selectedMobileSortOrder: 0,
    },
    acceptedSwapToS: undefined,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleTheme(draft, action: PayloadAction<{ theme: TTheme }>) {
            const {
                payload: { theme },
            } = action;

            draft.theme = theme;
        },
        toggleShowWidgetLib(draft) {
            draft.showWidgetLib = !draft.showWidgetLib;
        },
        toggleShowBalance(draft) {
            draft.showBalance = !draft.showBalance;
        },
        toggleWidgetsNavOpen(draft) {
            draft.mobile.widgetsNavOpen = !draft.mobile.widgetsNavOpen;
        },
        setStoreShowTutorial(draft, action: PayloadAction<{ show: boolean }>) {
            const {
                payload: { show },
            } = action;
            draft.tutorial.showTutorial = show;
        },
        setCurrentTutorialTip(
            draft,
            action: PayloadAction<{ tutorialTip: TTutorialTip }>
        ) {
            const {
                payload: { tutorialTip },
            } = action;
            draft.tutorial.currentTutorialTip = tutorialTip;
        },
        setCookieChoice(
            draft,
            action: PayloadAction<ECookieChoice | undefined>
        ) {
            draft.cookieChoice = action.payload;
        },
        setSelectedMobileSortOrder(
            draft,
            action: PayloadAction<{ sortOrder: number }>
        ) {
            draft.mobile.selectedMobileSortOrder = action.payload.sortOrder;
        },
        setAcceptedSwapToS(draft, action: PayloadAction<boolean | undefined>) {
            draft.acceptedSwapToS = action.payload;
        },
    },
});

export const {
    toggleTheme,
    toggleShowWidgetLib,
    toggleShowBalance,
    toggleWidgetsNavOpen,
    setStoreShowTutorial,
    setCurrentTutorialTip,
    setCookieChoice,
    setSelectedMobileSortOrder,
    setAcceptedSwapToS,
} = uiSlice.actions;
export default uiSlice.reducer;
