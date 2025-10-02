import { type FC, Suspense, useCallback, useMemo, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useWidgetHeight } from "src/api/hooks";
import { useGlobalSearch } from "src/api/hooks/useGlobalSearch";
import { useGetCoinsQuery } from "src/api/services";
import { ETag, TCoin, TKeyword } from "src/api/types";
import type { IModuleContainer } from "src/types";
import { EHeatmapMaxItems } from "../../components/market-heatmap/types";
import BaseContainer from "../base/BaseContainer";
import { MarketHeatmapModule } from "./MarketHeatmapModule";

const MarketHeatmapContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);
    const [maxItems, setMaxItems] = useState<EHeatmapMaxItems>(
        EHeatmapMaxItems.TwentyFive
    );

    // Fetch market data
    const {
        currentData: data,
        isFetching: isLoading,
        isError,
    } = useGetCoinsQuery({
        limit: maxItems,
        kasandra_supported: true,
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

            // Check if keyword already exists in the list
            const existingKeywordIndex = keywordSearchList.findIndex(
                (keyword) => keyword.id === coin.id
            );

            let updatedKeywords: TKeyword[];
            if (existingKeywordIndex !== -1) {
                // Remove the keyword if it exists (toggle off)
                updatedKeywords = keywordSearchList.filter(
                    (keyword) => keyword.id !== coin.id
                );
            } else {
                // Add the keyword if it doesn't exist (toggle on)
                updatedKeywords = [...keywordSearchList, coinKeyword];
                addKeywordToViewWidgets(coinKeyword);
                setLastSelectedKeyword(coinKeyword);
            }

            setKeywordSearchList(updatedKeywords);
        },
        [
            keywordSearchList,
            setKeywordSearchList,
            addKeywordToViewWidgets,
            setLastSelectedKeyword,
        ]
    );

    const contentHeight = useMemo(() => {
        return `${widgetHeight - 40}px`;
    }, [widgetHeight]);

    return (
        <BaseContainer
            uiProps={{
                dragProps: undefined,
                isDragging: false,
                onToggleShowFullSize: undefined,
                allowFullSize: false,
                showFullSize: false,
                setTutFocusElemRef: undefined,
            }}
            moduleData={moduleData}
            adjustable={false}
        >
            {isLoading ? (
                <ModuleLoader $height={contentHeight} />
            ) : (
                <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
                    <MarketHeatmapModule
                        data={data}
                        maxItems={maxItems}
                        isError={isError}
                        onCoinClick={handleCoinClick}
                        keywordSearchList={keywordSearchList}
                        onMaxItemsChange={setMaxItems}
                    />
                </Suspense>
            )}
        </BaseContainer>
    );
};

export default MarketHeatmapContainer;
