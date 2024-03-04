import { FC } from "react";
import { useAccount } from "src/api/hooks";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { ETutorialTipId } from "src/api/types";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const { openAuthModal, isAuthenticated, logout } = useAuth();
    const { userProfile } = useAccount();
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
            profile={userProfile}
        />
    );
};

export default ProfileDropdownContainer;
