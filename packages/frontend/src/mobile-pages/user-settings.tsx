import { useHistory } from "react-router-dom";
import { useAuth } from "src/api/hooks";
import UserMenu from "src/components/profile/UserMenu";
import PagedMobileLayout from "src/layout/PagedMobileLayout";

const UserSettings: React.FC = () => {
    const history = useHistory();
    const { isAuthenticated } = useAuth();

    return (
        <PagedMobileLayout
            title=""
            handleBack={() =>
                history.length > 1 ? history.goBack() : history.push("/")
            }
        >
            <UserMenu isAuthenticated={isAuthenticated} />
        </PagedMobileLayout>
    );
};

export default UserSettings;
