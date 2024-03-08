import { FC } from "react";
import { useAccount, useAuth } from "src/api/hooks";
import { debounce } from "src/api/utils/helpers";
import UserSettings from "src/mobile-components/profile/UserSettings";

const UserSettingsContainer: FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const { userProfile, saveProfile, isSavingProfile } = useAccount();

    return (
        <UserSettings
            profile={userProfile}
            isAuthenticated={isAuthenticated}
            onSaveProfile={debounce(saveProfile, 1000)}
            isSavingProfile={isSavingProfile}
            onLogout={logout}
        />
    );
};

export default UserSettingsContainer;
