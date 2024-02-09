import { useState } from "react";
import UserMenu from "src/components/profile/UserMenu";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
import MobileLayout from "src/layout/MobileLayout";
import SuperfeedContainer from "src/mobile-containers/SuperfeedContainer";
import UserFiltersContainer from "src/mobile-containers/UserFiltersContainer";

const SuperfeedPage = () => {
    const [showUserMenu, setshowUserMenu] = useState(false);
    const [showFeedFilters, setshowFeedFilters] = useState(false);
    const toggleFeedFilters = () => setshowFeedFilters(!showFeedFilters);
    return (
        <MobileLayout toggleShowUserMenu={() => setshowUserMenu(true)}>
            <UserFiltersContainer
                onToggleFeedFilters={toggleFeedFilters}
                show={showFeedFilters}
            />
            <UserMenu
                isOpen={showUserMenu}
                onClose={() => setshowUserMenu(false)}
                isAuthenticated={false}
            />
            <SuperfeedContainer onToggleFeedFilters={toggleFeedFilters} />
            <AuthPromptContainer />
        </MobileLayout>
    );
};

export default SuperfeedPage;
