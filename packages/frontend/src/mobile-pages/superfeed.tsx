import { useState } from "react";
import md5 from "md5";
import { useParams } from "react-router-dom";
import { useAccount, useControlledModal } from "src/api/hooks";
import MobileLayout from "src/layout/MobileLayout";
import AuthPromptContainer from "src/mobile-containers/AuthPromptContainer";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import { EMobileModalIds } from "src/routes";

const SuperfeedPage: React.FC = () => {
    const { tags } = useParams<{ tags?: string }>();
    const { setActiveModal } = useControlledModal();
    const { userProfile } = useAccount();
    const [showSearchBar, setShowSearchBar] = useState(false);

    const toggleFeedFilters = () => setActiveModal(EMobileModalIds.UserFilters);

    return (
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
    );
};

export default SuperfeedPage;
