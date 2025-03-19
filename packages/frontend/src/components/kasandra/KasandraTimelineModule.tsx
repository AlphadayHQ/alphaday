import { FC, memo } from "react";
import { ModuleLoader, TabsBar } from "@alphaday/ui-kit";
import { TNewsItem, EItemFeedPreference } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { translateLabels } from "src/api/utils/translationUtils";
import KasandraItemList from "./KasandraItemList";

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
const translateNavItems = () => [
    {
        label: translateLabels("Timeline"),
        value: EItemFeedPreference.Last,
    },
    // {
    //     label: translateLabels("Trending"),
    //     value: EItemFeedPreference.Trending,
    // },
    {
        label: translateLabels("Bookmarks"),
        value: EItemFeedPreference.Bookmark,
        auth: true,
    },
];

const KasandraTimelineModule: FC<INews> = memo(function KasandraTimelineModule({
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
    const newsNavItems = translateNavItems();
    const NavItemPreference =
        newsNavItems.find((item) => item.value === feedPreference) ||
        newsNavItems[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = newsNavItems.find((item) => item.value === value);
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
                    options={newsNavItems}
                    onChange={onTabOptionChange}
                    selectedOption={NavItemPreference}
                />
            </div>
            {isLoadingItems || !items ? (
                <ModuleLoader $height={`${widgetHeight}px`} />
            ) : (
                <KasandraItemList
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

export default KasandraTimelineModule;
