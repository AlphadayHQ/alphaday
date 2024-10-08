import { FC, memo } from "react";
import { ModuleLoader, TabsBar } from "@alphaday/ui-kit";
import { TNewsItem, EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
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
/**
 * This should ease adding new preference based buttons
 * auth can be set to true for buttons which require the user to be auth
 */
const NEWS_NAV_ITEMS = [
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
    const NavItemPreference =
        NEWS_NAV_ITEMS.find((item) => item.value === feedPreference) ||
        NEWS_NAV_ITEMS[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = NEWS_NAV_ITEMS.find((item) => item.value === value);
        if (optionItem === undefined) {
            Logger.debug("NewsModule::Nav option item not found");
            return;
        }
        onSetFeedPreference(optionItem?.value);
    };

    return (
        <>
            <div className="mx-2">
                <TabsBar
                    options={NEWS_NAV_ITEMS}
                    onChange={onTabOptionChange}
                    selectedOption={NavItemPreference}
                />
            </div>
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
