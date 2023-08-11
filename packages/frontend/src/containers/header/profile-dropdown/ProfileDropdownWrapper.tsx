import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
    Dropdown,
    DropdownAvatar,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    IconButton,
    twMerge,
} from "@alphaday/ui-kit";
import {
    EWalletViewState,
    TAuthWallet,
    WalletConnectionState,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import CONFIG from "src/config";
import globalMessages from "src/globalMessages";
import styles from "./ProfileDropdownWrapper.module.scss";
// TODO (xavier-charles): wallet view button
import WalletViewButton from "./WalletViewButton";

interface IProps {
    onConnectWallet: () => MaybeAsync<void>;
    onVerifyWallet: () => MaybeAsync<void>;
    onDisconnectWallet: () => MaybeAsync<void>;
    isAuthenticated: boolean;
    onShowTutorial: (s: boolean) => void;
    showTutorial: boolean | undefined;
    authWallet: TAuthWallet;
    walletViewState: EWalletViewState;
    navigateToWalletView: () => void;
    onAllowFetchWalletView: () => void;
    isWalletBoardAllowed: boolean;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const Divider = () => (
    <div className="border-btnRingVariant500 m-0 h-0 border-t border-solid" />
);

const ProfileDropdownWrapper: React.FC<IProps> = ({
    onConnectWallet,
    onVerifyWallet,
    onDisconnectWallet,
    onShowTutorial,
    showTutorial,
    isAuthenticated,
    authWallet,
    setTutFocusElemRef,
    walletViewState,
    navigateToWalletView,
    onAllowFetchWalletView,
    isWalletBoardAllowed,
}) => {
    const walletState = authWallet.status;
    const isVerifyPrompted = walletState !== WalletConnectionState.Prompted;
    const [toggleState, setToggleState] = useState(false);

    const handleToggle = () => {
        setToggleState((prev) => !prev);
        setTimeout(() => {
            onShowTutorial(true);
        }, 500);
    };

    const walletMenuOptions = useMemo(() => {
        if (walletState === WalletConnectionState.Disconnected) {
            return [
                {
                    handler: onConnectWallet,
                    menuTitle: "Connect Wallet",
                    title: globalMessages.portfolio.connectWallet,
                    dataTestId: "profile-dropdown-connect-wallet",
                },
            ];
        }
        if (walletState === WalletConnectionState.Connected) {
            return [
                {
                    handler: onDisconnectWallet,
                    menuTitle: "Disconnect Wallet",
                    title: "",
                    dataTestId: "profile-dropdown-disconnect-wallet",
                },
                {
                    handler: onVerifyWallet,
                    menuTitle: "Verify Your Wallet",
                    title: globalMessages.portfolio.verifyWallet,
                    dataTestId: "profile-dropdown-verify-wallet",
                },
            ];
        }
        if (
            walletState === WalletConnectionState.Verified ||
            walletState === WalletConnectionState.Prompted
        ) {
            return [
                {
                    handler: onDisconnectWallet,
                    menuTitle: "Disconnect Wallet",
                    title: "",
                    dataTestId: "profile-dropdown-disconnect-wallet",
                },
            ];
        }
        return [];
    }, [onConnectWallet, onDisconnectWallet, onVerifyWallet, walletState]);

    const handleWalletCopy = () => {
        const walletAddress = authWallet.account?.address;
        if (walletAddress)
            navigator.clipboard
                .writeText(walletAddress)
                .then(() => toast("Copied Wallet address!"))
                .catch(() =>
                    toast("Failed to copy address!", { type: EToastRole.Error })
                );
    };

    useEffect(() => {
        if (!showTutorial) setToggleState(false);
    }, [showTutorial]);

    const onClickWalletViewButton = useCallback(() => {
        if (walletViewState === EWalletViewState.Ready) {
            navigateToWalletView();
        }
        if (walletViewState === EWalletViewState.Authenticated) {
            onAllowFetchWalletView();
        }
    }, [walletViewState, onAllowFetchWalletView, navigateToWalletView]);

    return (
        <Dropdown direction="down" data-testid="profile-dropdown">
            <DropdownToggle>
                <span
                    ref={(ref) =>
                        setTutFocusElemRef && ref && setTutFocusElemRef(ref)
                    }
                >
                    <span className="items-[initial] flex h-[34px] w-[34px]">
                        <IconButton title="Open User Menu" variant="profile" />
                    </span>
                </span>
            </DropdownToggle>
            {isVerifyPrompted && !showTutorial && (
                <DropdownMenu
                    className={twMerge(
                        "twoCol:mt-[14.5px] twoCol:p-[18px_0px] left-auto right-0 -mr-2.5 mt-[11.5px] w-[275px] rounded-t-none rounded-bl rounded-br border-t-0 shadow-none",
                        styles["dropdown-menu"]
                    )}
                >
                    <div className="flex justify-between px-[18px] pb-2.5 pt-0">
                        <DropdownAvatar />
                        {isAuthenticated && authWallet.account?.address && (
                            <div className="flex flex-col items-end">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="mb-[5px] cursor-pointer"
                                    title="Copy wallet address"
                                    aria-label="Copy wallet address"
                                    onClick={handleWalletCopy}
                                    data-testid="profile-dropdown-wallet-address"
                                    data-address={authWallet.account.address}
                                >
                                    {truncateWithEllipsis(
                                        authWallet.account.address
                                    )}
                                </div>
                                {isWalletBoardAllowed && (
                                    <WalletViewButton
                                        walletViewState={walletViewState}
                                        onClick={onClickWalletViewButton}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <Divider />
                    {walletMenuOptions.map((option) => {
                        return (
                            <DropdownItem
                                key={option.dataTestId}
                                data-testid={option.dataTestId}
                                onClick={() => {
                                    option.handler()?.catch((err) => {
                                        Logger.error(
                                            "profile-dropdown:ProfileDropdownWrapper",
                                            err
                                        );
                                    });
                                }}
                            >
                                <span title={option.title}>
                                    {option.menuTitle}
                                </span>
                            </DropdownItem>
                        );
                    })}
                    <Divider />
                    <DropdownItem onClick={handleToggle}>
                        Tutorial{" "}
                        <input
                            title="Toggle Tutorial"
                            type="checkbox"
                            className={styles.toggle}
                            onChange={handleToggle}
                            checked={toggleState}
                        />
                    </DropdownItem>
                    <Divider />
                    {CONFIG.APP.VERSION && CONFIG.APP.COMMIT && (
                        <DropdownItem>
                            <div className="fontGroup-mini text-primaryVariant100">
                                Version: {CONFIG.APP.VERSION} <br />
                                Commit: {CONFIG.APP.COMMIT}
                            </div>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default ProfileDropdownWrapper;
