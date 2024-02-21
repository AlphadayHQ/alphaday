import { useState } from "react";
import { IonPage } from "@ionic/react";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
import MobileLayout from "src/layout/MobileLayout";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage: React.FC = () => {
    const [showFeedFilters, setshowFeedFilters] = useState(false);
    const toggleFeedFilters = () => setshowFeedFilters(!showFeedFilters);
    return (
        <IonPage>
            <MobileLayout>
                <UserFiltersContainer
                    onToggleFeedFilters={toggleFeedFilters}
                    show={showFeedFilters}
                />
                <AuthPromptContainer />
                <SuperfeedContainer onToggleFeedFilters={toggleFeedFilters} />
            </MobileLayout>
        </IonPage>
    );
};

export default SuperfeedPage;
