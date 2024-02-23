import { FC } from "react";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { ETutorialTipId } from "src/api/types";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const { openAuthModal, isAuthenticated, logout } = useAuth();
    const {
        showTutorial,
        currentTutorial,
        toggleShowTutorial,
        setTutFocusElemRef,
    } = useTutorial();

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
