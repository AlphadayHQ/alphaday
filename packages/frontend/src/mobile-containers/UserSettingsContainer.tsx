import { FC } from "react";
import { useAccount, useAuth } from "src/api/hooks";
import { toggleAboutModal } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";
import { debounce } from "src/api/utils/helpers";
import UserSettings from "src/mobile-components/profile/UserSettings";

const UserSettingsContainer: FC = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, logout } = useAuth();
    const { userProfile, saveProfile, isSavingProfile } = useAccount();

    const toggleAboutUsModal = () => dispatch(toggleAboutModal());

    return (
        <UserSettings
            profile={userProfile}
            isAuthenticated={isAuthenticated}
            onSaveProfile={debounce(saveProfile, 1000)}
            isSavingProfile={isSavingProfile}
            onLogout={logout}
            onShowAboutUsModal={toggleAboutUsModal}
        />
    );
};

export default UserSettingsContainer;
