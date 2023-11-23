import { FC, useEffect } from "react";
import { useAccount, useFeatureFlags, useView, useWallet } from "src/api/hooks";
import { useTutorial } from "src/api/hooks/useTutorial";
import { useWalletViewContext } from "src/api/store/providers/wallet-view-context";
import { ETutorialTipId, WalletConnectionState } from "src/api/types";
import { EFeaturesRegistry } from "src/constants";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const { openWalletConnectionDialog, verifyWallet, signout } = useWallet();
    const { authWallet, isAuthenticated, resetAuthState } = useAccount();
    const { setAllowFetchWalletView, walletViewState } = useWalletViewContext();
    const { subscribedViews, selectedView, navigateToView } = useView();
    const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    const navigateToWalletView = () => {
        if (subscribedViews !== undefined) {
            const walletView = subscribedViews?.find(
                (view) => view.data.is_smart
            );
            if (
                walletView?.data !== undefined &&
                selectedView?.data.hash !== walletView?.data.hash
            ) {
                // prevent unnecessary state change/navigation
                navigateToView(walletView?.data);
            }
        }
    };

    const onAllowFetchWalletView = () => {
        setAllowFetchWalletView(true);
    };

    const {
        showTutorial,
        currentTutorial,
        toggleShowTutorial,
        setTutFocusElemRef,
    } = useTutorial();

    useEffect(() => {
        /**
         * Reset the wallet connection state when the component mounts and the state is a transient state
         * This is necessary because the wallet connection state is persisted
         */
        if (
            !(
                authWallet.status === WalletConnectionState.Connected ||
                authWallet.status === WalletConnectionState.Verified ||
                authWallet.status === WalletConnectionState.Disconnected
            )
        ) {
            resetAuthState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProfileDropdownWrapper
            onConnectWallet={openWalletConnectionDialog}
            onVerifyWallet={verifyWallet}
            onDisconnectWallet={() => signout(false)}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            showTutorial={showTutorial}
            authWallet={authWallet}
            walletViewState={walletViewState}
            navigateToWalletView={navigateToWalletView}
            onAllowFetchWalletView={onAllowFetchWalletView}
            isWalletBoardAllowed={isWalletBoardAllowed}
            setTutFocusElemRef={
                currentTutorial.tip?.id === ETutorialTipId.ComeBack
                    ? setTutFocusElemRef
                    : undefined
            }
        />
    );
};

export default ProfileDropdownContainer;
