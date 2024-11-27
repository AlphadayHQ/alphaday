import { FC } from "react";
import { useAccount } from "src/api/hooks";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { toggleAboutModal, toggleLanguageModal } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { ETutorialTipId } from "src/api/types";
import ProfileDropdownWrapper from "./ProfileDropdownWrapper";

const ProfileDropdownContainer: FC = () => {
    const dispatch = useAppDispatch();
    const { openAuthModal, isAuthenticated, logout } = useAuth();
    const { userProfile } = useAccount();
    const {
        showTutorial,
        currentTutorial,
        toggleShowTutorial,
        setTutFocusElemRef,
    } = useTutorial();

    const toggleAboutUsModal = () => dispatch(toggleAboutModal());
    const onToggleLanguageModal = () => dispatch(toggleLanguageModal());

    return (
        <ProfileDropdownWrapper
            onSignOut={logout}
            onSignUpSignIn={openAuthModal}
            onToggleLanguageModal={onToggleLanguageModal}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            onShowAboutUsModal={toggleAboutUsModal}
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
