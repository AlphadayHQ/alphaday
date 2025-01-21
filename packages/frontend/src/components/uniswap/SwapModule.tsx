import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { SwapWidget, Theme, darkTheme } from "@uniswap/widgets";
import CONFIG from "src/config";
import ModuleDisclaimer from "../module-disclaimer/ModuleDisclaimer";
import "./SwapModule.scss";

interface IProps {
    config: {
        convenienceFee: number | undefined;
        convenienceFeeRecipient:
            | string
            | { [chainId: number]: string }
            | undefined;
    };
    theme: Theme;
    termsOfService: string;
    showToS: boolean;
    tokenList: string | undefined;
    /**
     * handler to call when user accepts terms of service
     */
    onAcceptToS: () => void;
}

const DEFAULT_HEIGHT = CONFIG.WIDGETS.COMMON.DEFAULT_WIDGET_HEIGHT;

const SwapModule: FC<IProps> = ({
    config,
    theme,
    showToS,
    termsOfService,
    onAcceptToS,
    tokenList,
}) => {
    if (!tokenList) return <ModuleLoader $height={`${DEFAULT_HEIGHT}px`} />;
    return (
        <div className="uniswap-widget">
            <ModuleDisclaimer
                disclaimer={termsOfService}
                show={showToS}
                onAccept={onAcceptToS}
            />
            <SwapWidget
                theme={theme || darkTheme}
                width="100%"
                convenienceFee={config.convenienceFee}
                convenienceFeeRecipient={config.convenienceFeeRecipient}
                tokenList={`${CONFIG.API.DEFAULT.BLOBS_URL}tokens-uniswap.json`}
            />
        </div>
    );
};

export default SwapModule;
