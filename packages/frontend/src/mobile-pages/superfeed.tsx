import MobileFilterContainer from "src/containers/mobile-filters/MobileFilterContainer";
import SuperfeedContainer from "src/containers/superfeed/SuperfeedContainer";
import MobileLayout from "src/layout/MobileLayout";

const SuperfeedPage = () => {
    return (
        <MobileLayout>
            <MobileFilterContainer />
            <SuperfeedContainer />
        </MobileLayout>
    );
};

export default SuperfeedPage;
