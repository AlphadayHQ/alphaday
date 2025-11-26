import { FC } from "react";
import { useAccount } from "src/api/hooks";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { toggleAboutModal, toggleLanguageModal } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import ProfileDropdownWrapperMobile from "./ProfileDropdownWrapperMobile";

const ProfileDropdownContainerMobile: FC = () => {
    const dispatch = useAppDispatch();
    const { openAuthModal, isAuthenticated, logout } = useAuth();
    const { userProfile } = useAccount();
    const { showTutorial, toggleShowTutorial } = useTutorial();

    const toggleAboutUsModal = () => dispatch(toggleAboutModal());
    const onToggleLanguageModal = () => dispatch(toggleLanguageModal());

    return (
        <ProfileDropdownWrapperMobile
            onSignOut={logout}
            onSignUpSignIn={openAuthModal}
            onToggleLanguageModal={onToggleLanguageModal}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            onShowAboutUsModal={toggleAboutUsModal}
            showTutorial={showTutorial}
            profile={userProfile}
        />
    );
};

export default ProfileDropdownContainerMobile;
