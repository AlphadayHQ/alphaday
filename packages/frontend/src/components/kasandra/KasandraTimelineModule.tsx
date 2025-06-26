import { FC, memo } from "react";
import { ModuleLoader, CoinSelect } from "@alphaday/ui-kit";
import {
    EItemFeedPreference,
    TChartRange,
    TCoin,
    TInsightItem,
} from "src/api/types";
import DateRangeBar from "../market/DateRangeBar";
import { EChartType, TMarketMeta } from "../market/types";
import KasandraItemList from "./KasandraItemList";

interface IKasandra {
    items: TInsightItem[] | undefined;
    selectedMarket: TCoin | undefined;
    isLoadingItems: boolean;
    // handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    selectedChartRange: TChartRange;
    onSelectChartRange: (range: TChartRange) => void;
    availableMarkets: TMarketMeta[];
    onSelectMarket: (market: TMarketMeta) => void;
    widgetHeight: number;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TInsightItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
}

const KasandraTimelineModule: FC<IKasandra> = memo(
    function KasandraTimelineModule({
        items,
        isLoadingItems,
        // handlePaginate,
        selectedChartRange,
        onSelectChartRange,
        widgetHeight,
        onClick,
        // isAuthenticated,
        selectedTimestamp,
        onSelectDataPoint,
        selectedMarket,
        availableMarkets,
        onSelectMarket,
    }) {
        return (
            <>
                <div className="mx-2 border-b border-borderLine">
                    <div className="flex justify-between">
                        <CoinSelect
                            coins={availableMarkets}
                            selectedCoin={selectedMarket}
                            onSelect={onSelectMarket}
                        />
                        <DateRangeBar
                            selectedChartRange={selectedChartRange}
                            onSelectChartRange={onSelectChartRange}
                            selectedChartType={EChartType.Line}
                            isKasandra
                        />
                    </div>
                </div>
                {isLoadingItems || !items ? (
                    <ModuleLoader $height={`${widgetHeight}px`} />
                ) : (
                    <KasandraItemList
                        timelineItems={items}
                        // handlePaginate={handlePaginate}
                        onClick={onClick}
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
