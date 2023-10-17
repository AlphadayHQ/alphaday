import { FC } from "react";
import { SwapWidget, Theme, darkTheme } from "@uniswap/widgets";
import ModuleDisclaimer from "../module-disclaimer/ModuleDisclaimer";
import "./SwapModule.module.scss";

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
    /**
     * handler to call when user accepts terms of service
     */
    onAcceptToS: () => void;
}

const SwapModule: FC<IProps> = ({
    config,
    theme,
    showToS,
    termsOfService,
    onAcceptToS,
}) => {
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
            />
        </div>
    );
};

export default SwapModule;
