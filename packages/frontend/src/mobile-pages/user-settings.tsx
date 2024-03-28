import PagedMobileLayout from "src/layout/PagedMobileLayout";
import UserSettingsContainer from "src/mobile-containers/UserSettingsContainer";

const UserSettings: React.FC = () => {
    return (
        <PagedMobileLayout title="">
            <UserSettingsContainer />
        </PagedMobileLayout>
    );
};

export default UserSettings;
