import { useState } from "react";
import { IonPage } from "@ionic/react";
import { useQuery } from "src/api/hooks";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
import MobileLayout from "src/layout/MobileLayout";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage: React.FC = () => {
    const query = useQuery();
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
                    tags={query.get("tags") ?? undefined}
                    showSearchBar={showSearchBar}
                    onToggleFeedFilters={toggleFeedFilters}
                />
            </MobileLayout>
        </IonPage>
    );
};

export default SuperfeedPage;
