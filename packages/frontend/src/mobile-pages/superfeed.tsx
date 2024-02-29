import { useState } from "react";
import { IonPage } from "@ionic/react";
import { useParams } from "react-router-dom";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
import MobileLayout from "src/layout/MobileLayout";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage: React.FC = () => {
    const { tags } = useParams<{ tags?: string }>();
    const [showFeedFilters, setshowFeedFilters] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const toggleFeedFilters = () => setshowFeedFilters(!showFeedFilters);

    return (
        <IonPage>
            <MobileLayout
                onSearchHandleClick={() => setShowSearchBar((show) => !show)}
            >
                <UserFiltersContainer
                    onToggleFeedFilters={toggleFeedFilters}
                    show={showFeedFilters}
                />
                <AuthPromptContainer />
                <SuperfeedContainer
                    tags={tags}
                    showSearchBar={showSearchBar}
                    onToggleFeedFilters={toggleFeedFilters}
                />
            </MobileLayout>
        </IonPage>
    );
};

export default SuperfeedPage;
