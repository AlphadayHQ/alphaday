import { useState } from "react";
import { IonPage } from "@ionic/react";
import md5 from "md5";
import { useParams } from "react-router-dom";
import { useAccount } from "src/api/hooks";
import MobileLayout from "src/layout/MobileLayout";
import AuthPromptContainer from "src/mobile-components/AuthPromptContainer";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage: React.FC = () => {
    const { tags } = useParams<{ tags?: string }>();
    const { userProfile } = useAccount();
    const [showFeedFilters, setShowFeedFilters] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const toggleFeedFilters = () => setShowFeedFilters(!showFeedFilters);

    return (
        <IonPage>
            <MobileLayout
                avatar={
                    userProfile?.user.email
                        ? `https://www.gravatar.com/avatar/${md5(
                              userProfile.user.email
                          ).toString()}?d=retro`
                        : undefined
                }
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
