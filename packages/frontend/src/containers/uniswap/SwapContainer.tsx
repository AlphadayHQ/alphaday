import { FC } from "react";
import { themeColors } from "@alphaday/ui-kit";
import { Theme } from "@uniswap/widgets";
import { setAcceptedSwapToS } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { Logger } from "src/api/utils/logging";
import SwapModule from "src/components/uniswap/SwapModule";
import CONFIG from "src/config/config";
import { IModuleContainer } from "src/types";
import TermsOfService from "./termsOfService";

Object.entries(CONFIG.UNISWAP).forEach(([key, value]) => {
    if (value === undefined) {
        Logger.warn(`Uniswap widget: parameter ${key} has not been provided`);
    }
});

const SwapContainer: FC<IModuleContainer> = () => {
    const dispatch = useAppDispatch();

    const acceptedSwapToS = useAppSelector((state) => state.ui.acceptedSwapToS);
    const acceptToS = () => {
        dispatch(setAcceptedSwapToS(true));
    };

    const theme: Theme = {
        primary: themeColors.primary,
        secondary: themeColors.primary,
        interactive: themeColors.btnRingVariant200,
        container: themeColors.backgroundVariant200,
        module: themeColors.backgroundVariant500,
        accent: themeColors.btnRingVariant200,
        outline: themeColors.backgroundVariant200,
        active: themeColors.btnBackgroundVariant1500,
        activeSoft: themeColors.btnBackgroundVariant1500,
        dialog: themeColors.primary,
        fontFamily: "",
        borderRadius: {
            xsmall: 1,
            small: 1,
            medium: 0.5,
            large: 0,
        },
    };

    return (
        <SwapModule
            theme={theme}
            config={CONFIG.UNISWAP}
            showToS={!acceptedSwapToS}
            termsOfService={TermsOfService}
            onAcceptToS={acceptToS}
        />
    );
};

export default SwapContainer;
