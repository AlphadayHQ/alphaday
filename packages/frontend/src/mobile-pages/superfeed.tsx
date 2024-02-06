import { FC, useRef, useState } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useOnScreen } from "src/api/hooks";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";
import MobileFilterContainer from "src/containers/mobile-filters/MobileFilterContainer";
import SuperfeedContainer from "src/containers/superfeed/SuperfeedContainer";
import MobileLayout from "src/layout/MobileLayout";

const FiltersButton: FC<{ toggleFeedFilters: () => void }> = ({
    toggleFeedFilters,
}) => {
    const element1: React.Ref<HTMLDivElement> = useRef(null);
    const element2: React.Ref<HTMLDivElement> = useRef(null);
    const element1Visible = useOnScreen(element1);

    return (
        <>
            <div
                ref={element1}
                className="flex justify-between mt-2 mb-3 mx-5 px-4 py-2 border border-accentVariant100 rounded-lg"
                onClick={toggleFeedFilters}
                tabIndex={0}
                role="button"
            >
                <p className="m-0 pr-2 fontGroup-highlight self-center">
                    Craft your superfeed with personalized filters
                </p>
                <SettingsSVG className="w-6 text-accentVariant100 mt-[3px]" />
            </div>
            <div
                ref={element2}
                onClick={toggleFeedFilters}
                tabIndex={0}
                role="button"
                title="Open filters"
                className={twMerge(
                    "absolute bg-accentVariant100 rounded-lg p-4 bottom-24 right-5 z-10 delay-300",
                    element1Visible && "hidden delay-0"
                )}
            >
                <Settings2SVG className="w-6 text-primary" />
            </div>
        </>
    );
};

const SuperfeedPage = () => {
    const [showFeedFilters, setshowFeedFilters] = useState(false);
    const toggleFeedFilters = () => setshowFeedFilters(!showFeedFilters);
    return (
        <MobileLayout>
            <FiltersButton toggleFeedFilters={toggleFeedFilters} />
            <MobileFilterContainer
                toggleFeedFilters={toggleFeedFilters}
                show={showFeedFilters}
            />
            <SuperfeedContainer />
        </MobileLayout>
    );
};

export default SuperfeedPage;
