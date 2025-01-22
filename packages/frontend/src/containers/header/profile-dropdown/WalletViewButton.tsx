import { FC } from "react";
import { Button, Spinner, twMerge } from "@alphaday/ui-kit";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { EWalletViewState } from "src/api/types";
import {
    getWalletViewStateMessages,
    onClickNoTags,
} from "src/api/utils/walletViewUtils";
import { ReactComponent as WandSVG } from "src/assets/icons/wand.svg";
import { withFeature } from "src/containers/features/withFeature";
import { EFeaturesRegistry } from "src/constants";

interface IWalletViewButton {
    walletViewState: EWalletViewState;
    onClick: () => void;
}

const viewButtonChild = (t: TFunction<"translation", undefined>) => {
    const child: { [key in EWalletViewState]: JSX.Element } = {
        [EWalletViewState.Ready]: (
            <span className="button-text ml-[5px] text-white">
                {t("walletView.viewWalletBoard")}
            </span>
        ),
        [EWalletViewState.Fetching]: (
            <>
                <Spinner className="text-secondaryOrange h-[13px] w-[13px] border-[0.2em]" />
                <span className="button-text ml-[5px] text-white">
                    {t("walletView.creatingWalletBoard")}
                </span>
            </>
        ),
        [EWalletViewState.NoTags]: (
            <span className="button-text ml-[5px] text-white">
                Empty wallet
            </span>
        ),
        [EWalletViewState.Authenticated]: (
            <>
                <WandSVG className="h-3 w-3 text-white" />
                <span className="button-text ml-[5px] text-white">
                    {t("walletView.createWalletBoard")}
                </span>
            </>
        ),
        [EWalletViewState.Disabled]: (
            <>
                <WandSVG className="h-3 w-3 text-white" />
                <span className="button-text ml-[5px] text-white">
                    {t("walletView.createWalletBoard")}
                </span>
            </>
        ),
    };
    return child;
};

const WalletViewButton: FC<IWalletViewButton> = ({
    walletViewState,
    onClick,
}) => {
    const { t } = useTranslation();

    const isFetchingWalletView = walletViewState === EWalletViewState.Fetching;
    const noTags = walletViewState === EWalletViewState.NoTags;

    return (
        <div>
            <Button
                variant="extraSmall"
                className={twMerge(
                    isFetchingWalletView &&
                        "bg-[transparent] pr-0 [&>.button-text]:text-white",
                    "border-secondaryOrangeFiltered bg-transparent hover:border-secondaryOrange100 [&>.button-text]:text-secondaryOrange [&>.button-text]:fontGroup-mini [&>.button-text]:!tracking-wider border-solid border"
                )}
                onClick={noTags ? onClickNoTags : onClick}
                disabled={isFetchingWalletView}
                title={getWalletViewStateMessages(walletViewState)}
            >
                {viewButtonChild(t)[walletViewState]}
            </Button>
        </div>
    );
};

export default withFeature(WalletViewButton, EFeaturesRegistry.WalletBoard);
