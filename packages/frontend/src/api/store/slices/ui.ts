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
    showAboutModal: boolean;
    tutorial: ITutorialState;
    cookieChoice: ECookieChoice | undefined;
    mobile: {
        widgetsNavOpen: boolean;
        selectedMobileSortOrder: number;
        lastInstallPromptTimestamp: number | undefined;
    };
    acceptedSwapToS: boolean | undefined;
    lastAuthPrompted: number | undefined;
}

const initialState: IUIState = {
    theme: "dark",
    showWidgetLib: false,
    showAboutModal: false,
    showBalance: true,
    tutorial: { showTutorial: undefined, currentTutorialTip: undefined },
    cookieChoice: undefined,
    mobile: {
        widgetsNavOpen: false,
        selectedMobileSortOrder: 0,
        lastInstallPromptTimestamp: undefined,
    },
    acceptedSwapToS: undefined,
    lastAuthPrompted: undefined,
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
        toggleAboutModal(draft) {
            draft.showAboutModal = !draft.showAboutModal;
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
        setLastAuthPrompted(draft, action: PayloadAction<number>) {
            draft.lastAuthPrompted = action.payload;
        },
        setLastInstallPromptTimestamp(draft, action: PayloadAction<number>) {
            draft.mobile.lastInstallPromptTimestamp = action.payload;
        },
    },
});

export const {
    toggleTheme,
    toggleShowWidgetLib,
    toggleShowBalance,
    toggleAboutModal,
    toggleWidgetsNavOpen,
    setStoreShowTutorial,
    setCurrentTutorialTip,
    setCookieChoice,
    setSelectedMobileSortOrder,
    setAcceptedSwapToS,
    setLastAuthPrompted,
    setLastInstallPromptTimestamp,
} = uiSlice.actions;
export default uiSlice.reducer;
