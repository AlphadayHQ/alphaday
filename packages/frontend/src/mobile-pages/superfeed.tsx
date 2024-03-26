import { useState } from "react";
import { IonPage } from "@ionic/react";
import md5 from "md5";
import { useParams, useHistory } from "react-router-dom";
import { useAccount } from "src/api/hooks";
import MobileLayout from "src/layout/MobileLayout";
import AuthPromptContainer from "src/mobile-containers/AuthPromptContainer";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import { EMobileRoutePaths } from "src/routes";

const SuperfeedPage: React.FC = () => {
    const { tags } = useParams<{ tags?: string }>();
    const history = useHistory();
    const { userProfile } = useAccount();
    const [showSearchBar, setShowSearchBar] = useState(false);

    const toggleFeedFilters = () => history.push(EMobileRoutePaths.UserFilters);

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
