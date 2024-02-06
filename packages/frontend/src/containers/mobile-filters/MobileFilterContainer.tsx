import { FC } from "react";
import MobileFiltersModule from "src/components/mobile-filters/MobileFiltersModule";

const MobileFilterContainer: FC<{
    toggleFeedFilters: () => void;
    show: boolean;
}> = ({ toggleFeedFilters, show }) => {
    return (
        <MobileFiltersModule
            toggleFeedFilters={toggleFeedFilters}
            show={show}
        />
    );
};

export default MobileFilterContainer;
