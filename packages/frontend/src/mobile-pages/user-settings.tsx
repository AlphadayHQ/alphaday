import { IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import PagedMobileLayout from "src/layout/PagedMobileLayout";
import UserSettingsContainer from "src/mobile-containers/UserSettingsContainer";

const UserSettings: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <PagedMobileLayout
                title=""
                handleBack={() =>
                    history.length > 1
                        ? history.goBack()
                        : history.push("/", {})
                }
            >
                <UserSettingsContainer />
            </PagedMobileLayout>
        </IonPage>
    );
};

export default UserSettings;
