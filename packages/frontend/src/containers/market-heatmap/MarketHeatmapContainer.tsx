import { type FC, useCallback, useState } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useGlobalSearch } from "src/api/hooks/useGlobalSearch";
import { useGetCoinsQuery } from "src/api/services";
import { ETag, TCoin } from "src/api/types";
import type { IModuleContainer } from "src/types";
import { MarketHeatmapModule } from "./MarketHeatmapModule";

const MarketHeatmapContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);
    const [maxItems] = useState(50);

    // Fetch market data
    const {
        currentData: data,
        isLoading,
        isError,
    } = useGetCoinsQuery({
        limit: maxItems,
    });

    const {
        keywordSearchList,
        setKeywordSearchList,
        addKeywordToViewWidgets,
        setLastSelectedKeyword,
    } = useGlobalSearch();

    // Handle coin click navigation
    const handleCoinClick = useCallback(
        (coin: TCoin) => {
            // Create a keyword object for the coin
            const coinTag = coin.tags?.[0];
            if (!coinTag) return;
            const coinKeyword = {
                id: coin.id,
                name: coin.name,
                tag: {
                    ...coinTag,
                    tagType: ETag.Global,
                },
            };

            // Add the keyword to the board's keyword list
            const updatedKeywords = [...keywordSearchList, coinKeyword];
            setKeywordSearchList(updatedKeywords);
            addKeywordToViewWidgets(coinKeyword);
            setLastSelectedKeyword(coinKeyword);
        },
        [
            keywordSearchList,
            setKeywordSearchList,
            addKeywordToViewWidgets,
            setLastSelectedKeyword,
        ]
    );

    return (
        <MarketHeatmapModule
            data={data}
            isLoading={isLoading}
            isError={isError}
            widgetHeight={widgetHeight}
            onCoinClick={handleCoinClick}
        />
    );
};

export default MarketHeatmapContainer;
