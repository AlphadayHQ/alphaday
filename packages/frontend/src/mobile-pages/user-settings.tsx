import { IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "src/api/hooks";
import PagedMobileLayout from "src/layout/PagedMobileLayout";
import UserMenu from "src/mobile-components/profile/UserMenu";

const UserSettings: React.FC = () => {
    const history = useHistory();
    const { isAuthenticated, logout } = useAuth();

    return (
        <IonPage>
            <PagedMobileLayout
                title=""
                handleBack={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            >
                <UserMenu isAuthenticated={isAuthenticated} onLogout={logout} />
            </PagedMobileLayout>
        </IonPage>
    );
};

export default UserSettings;
