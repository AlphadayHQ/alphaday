import { IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import PagedMobileLayout from "src/layout/PagedMobileLayout";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const UserSettings: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <PagedMobileLayout
                title="Superfeed filters"
                handleBack={() =>
                    history.length > 1
                        ? history.goBack()
                        : history.push("/", {})
                }
            >
                <UserFiltersContainer />
            </PagedMobileLayout>
        </IonPage>
    );
};

export default UserSettings;
