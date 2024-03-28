import PagedMobileLayout from "src/layout/PagedMobileLayout";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const UserSettings: React.FC = () => {
    return (
        <PagedMobileLayout title="Superfeed filters">
            <UserFiltersContainer />
        </PagedMobileLayout>
    );
};

export default UserSettings;
