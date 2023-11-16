import { FC } from "react";
import { Spinner, TViewTabMenuOption, ViewTabButton } from "@alphaday/ui-kit";
import { EWalletViewState } from "src/api/types";
import { validateEthAddr } from "src/api/utils/accountUtils";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import {
    getWalletViewStateMessages,
    onClickDisabled,
    onClickNoTags,
} from "src/api/utils/walletViewUtils";
import { ReactComponent as WandSVG } from "src/assets/icons/wand.svg";

interface IWalletViewTabButton {
    onClick: () => void;
    walletViewState: EWalletViewState;
    isModified: boolean;
    isSelected: boolean;
    walletViewName: string | undefined;
    options?: TViewTabMenuOption[];
}

const getViewTabButtonChild = (
    walletViewState: EWalletViewState,
    walletViewName: string | undefined
) => {
    if (walletViewState === EWalletViewState.Fetching) {
        return <Spinner className="spinner" />;
    }
    if (walletViewState === EWalletViewState.Ready && walletViewName) {
        return (
            <span className="name">
                {validateEthAddr(walletViewName)
                    ? truncateWithEllipsis(walletViewName, 10)
                    : walletViewName}
            </span>
        );
    }
    return <WandSVG className="wand" />;
};

const WalletViewTabButton: FC<IWalletViewTabButton> = ({
    onClick,
    walletViewState,
    isModified,
    isSelected,
    walletViewName,
    options,
}) => {
    const onButtonClick = () => {
        if (walletViewState === EWalletViewState.NoTags) {
            onClickNoTags();
        } else if (walletViewState === EWalletViewState.Disabled) {
            onClickDisabled();
        } else {
            onClick();
        }
    };

    return (
        <ViewTabButton
            className={`[&_.name]:text-secondaryOrange ${
                isSelected ? "tabButton selected" : "tabButton"
            }`}
            onClick={onButtonClick}
            title={getWalletViewStateMessages(walletViewState)}
            modified={isModified}
            selected={isSelected}
            options={
                walletViewState === EWalletViewState.Ready ? options : undefined
            }
        >
            {getViewTabButtonChild(walletViewState, walletViewName)}
        </ViewTabButton>
    );
};

export default WalletViewTabButton;
