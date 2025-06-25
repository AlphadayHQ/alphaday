import { FC, memo } from "react";
import { ModuleLoader, TabsBar } from "@alphaday/ui-kit";
import { EItemFeedPreference, TCoin, TInsightItem } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { translateLabels } from "src/api/utils/translationUtils";
import KasandraItemList from "./KasandraItemList";

interface IKasandra {
    items: TInsightItem[] | undefined;
    selectedMarket: TCoin | undefined;
    isLoadingItems: boolean;
    // handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    widgetHeight: number;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TInsightItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
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

const KasandraTimelineModule: FC<IKasandra> = memo(
    function KasandraTimelineModule({
        items,
        isLoadingItems,
        // handlePaginate,
        feedPreference,
        onSetFeedPreference,
        widgetHeight,
        onClick,
        // onBookmark,
        // isAuthenticated,
        selectedTimestamp,
        onSelectDataPoint,
        selectedMarket,
    }) {
        const newsNavItems = translateNavItems();
        const NavItemPreference =
            newsNavItems.find((item) => item.value === feedPreference) ||
            newsNavItems[0];

        const onTabOptionChange = (value: string) => {
            const optionItem = newsNavItems.find(
                (item) => item.value === value
            );
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
                        // items={items}
                        timelineItems={items}
                        // handlePaginate={handlePaginate}
                        onClick={onClick}
                        // onBookmark={onBookmark}
                        // isAuthenticated={isAuthenticated}
                        selectedTimestamp={selectedTimestamp}
                        selectedMarket={selectedMarket}
                        onSelectDataPoint={onSelectDataPoint}
                    />
                )}
            </>
        );
    }
);

export default KasandraTimelineModule;
