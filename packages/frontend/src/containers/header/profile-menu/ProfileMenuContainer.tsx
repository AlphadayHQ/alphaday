import { FC } from "react";
import { useAccount } from "src/api/hooks";
import { useAuth } from "src/api/hooks/useAuth";
import { useTutorial } from "src/api/hooks/useTutorial";
import { toggleAboutModal, toggleLanguageModal } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { ETutorialTipId } from "src/api/types";
import ProfileMenuWrapper from "./ProfileMenuWrapper";

interface IProps {
    isMobile?: boolean;
    onCloseMenu?: () => void;
}

const ProfileMenuContainer: FC<IProps> = ({
    isMobile = false,
    onCloseMenu,
}) => {
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
        <ProfileMenuWrapper
            onSignOut={logout}
            onSignUpSignIn={() => {
                if (onCloseMenu) onCloseMenu();
                openAuthModal();
            }}
            onToggleLanguageModal={() => {
                if (onCloseMenu) onCloseMenu();
                onToggleLanguageModal();
            }}
            isAuthenticated={isAuthenticated}
            onShowTutorial={toggleShowTutorial}
            onShowAboutUsModal={() => {
                if (onCloseMenu) onCloseMenu();
                toggleAboutUsModal();
            }}
            showTutorial={showTutorial}
            setTutFocusElemRef={
                currentTutorial.tip?.id === ETutorialTipId.ComeBack
                    ? setTutFocusElemRef
                    : undefined
            }
            profile={userProfile}
            isMobile={isMobile}
        />
    );
};

export default ProfileMenuContainer;
