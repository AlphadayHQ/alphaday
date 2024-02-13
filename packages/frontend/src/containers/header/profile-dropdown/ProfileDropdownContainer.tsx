import { FC, useEffect } from "react";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { EAuthState, ETutorialTipId } from "src/api/types";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const {
        openAuthModal,
        authState,
        isAuthenticated,
        resetAuthState,
        logout,
    } = useAuth();
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
            onSignOut={logout}
            onSignUpSignIn={openAuthModal}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            showTutorial={showTutorial}
            setTutFocusElemRef={
                currentTutorial.tip?.id === ETutorialTipId.ComeBack
                    ? setTutFocusElemRef
                    : undefined
            }
        />
    );
};

export default ProfileDropdownContainer;
