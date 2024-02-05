import { useRef, FC, FormEvent, useCallback } from "react";
import { twMerge, FeedCard, ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { Link } from "react-router-dom";
import { useOnScreen } from "src/api/hooks";
import { TSuperfeedItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";

interface ISuperfeedModule {
    isLoading: boolean;
    feed: TSuperfeedItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
}

const FiltersButton = () => {
    const element1: React.Ref<HTMLAnchorElement> = useRef(null);
    const element2: React.Ref<HTMLAnchorElement> = useRef(null);
    const element1Visible = useOnScreen(element1);

    return (
        <>
            <Link
                ref={element1}
                className="flex justify-between mt-2 mb-3 px-4 py-2 border border-accentVariant100 rounded-lg"
                to="/filters"
            >
                <p className="m-0 pr-2 fontGroup-highlight self-center">
                    Craft your superfeed with personalized filters
                </p>
                <SettingsSVG className="w-6 text-accentVariant100 mt-[3px]" />
            </Link>
            <Link
                ref={element2}
                to="/filters"
                className={twMerge(
                    "absolute bg-accentVariant100 rounded-lg p-4 bottom-24 right-5 z-10 delay-300",
                    element1Visible && "hidden delay-0"
                )}
            >
                <Settings2SVG className="w-6 text-primary" />
            </Link>
        </>
    );
};

const SuperfeedModule: FC<ISuperfeedModule> = ({
    isLoading,
    feed,
    handlePaginate,
}) => {
    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handlePaginate("next");
            }
        },
        [handlePaginate]
    );
    if (isLoading || feed === undefined) {
        return <ModuleLoader $height="100%" />;
    }

    return (
        <ScrollBar onScroll={handleScrollEvent} className="w-full px-5 pt-4">
            <FiltersButton />
            {feed.map((item) => (
                <FeedCard key={item.id} item={item} />
            ))}
        </ScrollBar>
    );
};

export default SuperfeedModule;
