import { FC, useRef, useState } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useOnScreen } from "src/api/hooks";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";
import AuthPromptContainer from "src/containers/dialogs/AuthPromptContainer";
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
                className="border-accentVariant100 mx-5 mb-3 mt-2 flex justify-between rounded-lg border px-4 py-2"
                onClick={toggleFeedFilters}
                tabIndex={0}
                role="button"
            >
                <p className="fontGroup-highlight m-0 self-center pr-2">
                    Craft your superfeed with personalized filters
                </p>
                <SettingsSVG className="text-accentVariant100 mt-[3px] w-6" />
            </div>
            <div
                ref={element2}
                onClick={toggleFeedFilters}
                tabIndex={0}
                role="button"
                title="Open filters"
                className={twMerge(
                    "bg-accentVariant100 absolute bottom-24 right-5 z-10 rounded-lg p-4 delay-300",
                    element1Visible && "hidden delay-0"
                )}
            >
                <Settings2SVG className="text-primary w-6" />
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
            <AuthPromptContainer />
        </MobileLayout>
    );
};

export default SuperfeedPage;
