import { FC, memo } from "react";
import { ModuleLoader, SwitchWrap, TabButton } from "@alphaday/ui-kit";
import { TNewsItem, EItemFeedPreference } from "src/api/types";
import NewsItemList from "./NewsItemList";

interface INews {
    items: TNewsItem[] | undefined;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    widgetHeight: number;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TNewsItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
}
const SWITCH_HEIGHT = 50;

/**
 * This should ease adding new preference based buttons
 * auth can be set to true for buttons which require the user to be auth
 */
const NEWS_NAV_BUTTONS = [
    {
        label: "Feed",
        value: EItemFeedPreference.Last,
    },
    {
        label: "Trending",
        value: EItemFeedPreference.Trending,
    },
    {
        label: "Read Later",
        value: EItemFeedPreference.Bookmark,
        auth: true,
    },
];

const NewsModule: FC<INews> = memo(function NewsModule({
    items,
    isLoadingItems,
    handlePaginate,
    feedPreference,
    onSetFeedPreference,
    widgetHeight,
    onClick,
    onBookmark,
    isAuthenticated,
}) {
    return (
        <>
            <SwitchWrap
                $height={SWITCH_HEIGHT}
                $isLoading={isLoadingItems || !items}
            >
                {NEWS_NAV_BUTTONS.map(
                    (nav) =>
                        ((nav.auth === true && isAuthenticated) ||
                            !nav.auth) && (
                            <span key={String(nav.value)} className="mr-3">
                                <TabButton
                                    variant="small"
                                    uppercase={false}
                                    open={feedPreference === nav.value}
                                    onClick={() =>
                                        onSetFeedPreference(nav.value)
                                    }
                                >
                                    {nav.label}
                                </TabButton>
                            </span>
                        )
                )}
            </SwitchWrap>
            {isLoadingItems || !items ? (
                <ModuleLoader $height={`${widgetHeight}px`} />
            ) : (
                <NewsItemList
                    items={items}
                    handlePaginate={handlePaginate}
                    onClick={onClick}
                    onBookmark={onBookmark}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </>
    );
});

export default NewsModule;
