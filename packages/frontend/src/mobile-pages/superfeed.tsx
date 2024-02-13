import { useState } from "react";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
import MobileLayout from "src/layout/MobileLayout";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage = () => {
    const [showFeedFilters, setshowFeedFilters] = useState(false);
    const toggleFeedFilters = () => setshowFeedFilters(!showFeedFilters);
    return (
        <MobileLayout>
            <UserFiltersContainer
                onToggleFeedFilters={toggleFeedFilters}
                show={showFeedFilters}
            />
            <AuthPromptContainer />
            <SuperfeedContainer onToggleFeedFilters={toggleFeedFilters} />
        </MobileLayout>
    );
};

export default SuperfeedPage;
