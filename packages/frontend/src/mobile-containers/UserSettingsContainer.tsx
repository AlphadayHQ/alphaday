import { FC } from "react";
import { useAuth } from "src/api/hooks";
import UserSettings from "src/mobile-components/profile/UserSettings";

/**
 * Note on filter data tyos: Some filters have a 1-to-1 correspondance with
 * the tag model. Others, like coins and projects/chains, include a parent tag
 * field which we use to identify the unique tag they belong to.
 */

const UserSettingsContainer: FC = () => {
    const { isAuthenticated, logout } = useAuth();
    return <UserSettings isAuthenticated={isAuthenticated} onLogout={logout} />;
};

export default UserSettingsContainer;
