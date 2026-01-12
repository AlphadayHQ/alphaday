import { FC, useMemo } from "react";
import type { TGetCoinsResponse } from "src/api/services";
import { TCoin, TKeyword } from "src/api/types";
import { MarketHeatmap } from "src/components/market-heatmap/MarketHeatmap";
import { EHeatmapMaxItems } from "src/components/market-heatmap/types";

interface IMarketHeatmapModule {
    data: TGetCoinsResponse | undefined;
    isError: boolean;
    onCoinClick: (coinData: TCoin) => void;
    keywordSearchList: TKeyword[];
    maxItems: EHeatmapMaxItems;
    onMaxItemsChange: (maxItems: EHeatmapMaxItems) => void;
    height?: number;
}

export const MarketHeatmapModule: FC<IMarketHeatmapModule> = ({
    data,
    maxItems,
    isError,
    onCoinClick,
    keywordSearchList,
    onMaxItemsChange,
    height,
}) => {
    const transformedData = useMemo(() => {
        if (!data?.results) return [];
        return data.results;
    }, [data]);

    return (
        <div className="h-[500px]">
            {isError && (
                <div className="flex items-center justify-center h-full text-primaryVariant100">
                    Failed to load market data
                </div>
            )}
            <MarketHeatmap
                maxItems={maxItems}
                data={transformedData}
                onCoinClick={onCoinClick}
                keywordSearchList={keywordSearchList}
                onMaxItemsChange={onMaxItemsChange}
                height={height}
            />
        </div>
    );
};
