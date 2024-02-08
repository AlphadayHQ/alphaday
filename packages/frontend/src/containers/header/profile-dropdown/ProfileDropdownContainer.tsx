import { FC, useEffect } from "react";
// import { useFeatureFlags, useView } from "src/api/hooks";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
// import { useWalletViewContext } from "src/api/store/providers/wallet-view-context";
import { EAuthState, ETutorialTipId } from "src/api/types";
// import { EFeaturesRegistry } from "src/constants";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const { openAuthModal, authState, isAuthenticated, resetAuthState } =
        useAuth();
    // const { setAllowFetchWalletView, walletViewState } = useWalletViewContext();
    // const { subscribedViews, selectedView, navigateToView } = useView();
    // const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    // const navigateToWalletView = () => {
    //     if (subscribedViews !== undefined) {
    //         const walletView = subscribedViews?.find(
    //             (view) => view.data.is_smart
    //         );
    //         if (
    //             walletView?.data !== undefined &&
    //             selectedView?.data.hash !== walletView?.data.hash
    //         ) {
    //             // prevent unnecessary state change/navigation
    //             navigateToView(walletView?.data);
    //         }
    //     }
    // };

    // const onAllowFetchWalletView = () => {
    //     setAllowFetchWalletView(true);
    // };

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
                authState.status === EAuthState.SigningIn ||
                authState.status === EAuthState.SelectingMethod ||
                authState.status === EAuthState.GenericError
            )
        ) {
            resetAuthState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProfileDropdownWrapper
            onSignUpSignIn={openAuthModal}
            // onConnectWallet={openWalletConnectionDialog}
            // onVerifyWallet={verifyWallet}
            // onDisconnectWallet={() => signout(false)}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            showTutorial={showTutorial}
            // authWallet={authWallet}
            // walletViewState={walletViewState}
            // navigateToWalletView={navigateToWalletView}
            // onAllowFetchWalletView={onAllowFetchWalletView}
            // isWalletBoardAllowed={isWalletBoardAllowed}
            setTutFocusElemRef={
                currentTutorial.tip?.id === ETutorialTipId.ComeBack
                    ? setTutFocusElemRef
                    : undefined
            }
        />
    );
};

export default ProfileDropdownContainer;
