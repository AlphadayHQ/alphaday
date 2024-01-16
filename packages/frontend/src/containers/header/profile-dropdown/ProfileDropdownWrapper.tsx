import { useCallback, useEffect, useState, useMemo } from "react";
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
    onSignUpSignIn: () => MaybeAsync<void>;
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
    <div className="border-borderLine m-0 h-0 border-t border-solid" />
);

const ProfileDropdownWrapper: React.FC<IProps> = ({
    onSignUpSignIn,
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
        const signUpOptions = {
            handler: onSignUpSignIn,
            menuTitle: "Sign Up / Sign In",
            title: globalMessages.portfolio.signUp,
            dataTestId: "profile-dropdown-sign-up",
        };
        if (walletState === WalletConnectionState.Disconnected) {
            return [
                signUpOptions,
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
                signUpOptions,
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
                signUpOptions,
                {
                    handler: onDisconnectWallet,
                    menuTitle: "Disconnect Wallet",
                    title: "",
                    dataTestId: "profile-dropdown-disconnect-wallet",
                },
            ];
        }
        return [signUpOptions];
    }, [
        onConnectWallet,
        onSignUpSignIn,
        onDisconnectWallet,
        onVerifyWallet,
        walletState,
    ]);

    const handleWalletCopy = () => {
        const walletAddress = authWallet.account?.address;
        if (walletAddress) {
            navigator.clipboard
                .writeText(walletAddress)
                .then(() => toast("Copied Wallet address!"))
                .catch(() =>
                    toast("Failed to copy address!", { type: EToastRole.Error })
                );
        }
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
                    <span className="items-[initial] flex h-[34px] hover:bg-backgroundVariant200 rounded-lg pl-1">
                        <IconButton
                            title="Open User Menu"
                            variant="profile"
                            className="!border-none !bg-transparent [&_svg]:!w-3.5 [&_svg]:!h-3.5"
                        />
                    </span>
                </span>
            </DropdownToggle>
            {isVerifyPrompted && !showTutorial && (
                <DropdownMenu
                    className={twMerge(
                        "mt-1 two-col:p-[18px_0px] left-auto right-0 w-[275px] rounded-t-none rounded-bl rounded-br border border-solid border-borderLine rounded-lg shadow-none",
                        styles["dropdown-menu"]
                    )}
                >
                    <div className="mx-2">
                        <div className="flex justify-between px-2 pb-5 pt-0">
                            <DropdownAvatar />
                            {isAuthenticated && authWallet.account?.address && (
                                <div className="flex flex-col items-end">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="mb-[5px] cursor-pointer fontGroup-normal text-primary self-center"
                                        title="Copy wallet address"
                                        aria-label="Copy wallet address"
                                        onClick={handleWalletCopy}
                                        data-testid="profile-dropdown-wallet-address"
                                        data-address={
                                            authWallet.account.address
                                        }
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
                                <>
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
                                    <Divider />
                                </>
                            );
                        })}
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
                            <DropdownItem className="hover:bg-background pt-5 pb-0">
                                <div className="fontGroup-mini w-full">
                                    Version: {CONFIG.APP.VERSION}
                                    <br />
                                    Commit: {CONFIG.APP.COMMIT}
                                </div>
                            </DropdownItem>
                        )}
                    </div>
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default ProfileDropdownWrapper;
