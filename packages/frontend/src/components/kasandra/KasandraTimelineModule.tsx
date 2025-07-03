import { FC, memo, useMemo, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import {
    EItemFeedPreference,
    EPredictionCase,
    TCoin,
    TInsightItem,
} from "src/api/types";
import { TMarketMeta } from "../market/types";
import { CaseSelect, TCase } from "./CaseSelect";
import { CoinSelect } from "./CoinSelect";
import KasandraItemList from "./KasandraItemList";

interface IKasandra {
    items: TInsightItem[] | undefined;
    selectedMarket: TCoin | undefined;
    isLoadingItems: boolean;
    // handlePaginate: (type: "next" | "previous") => void;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    supportedCoins: TCoin[];
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
        widgetHeight,
        onClick,
        // isAuthenticated,
        selectedTimestamp,
        onSelectDataPoint,
        selectedMarket,
        supportedCoins,
        onSelectMarket,
    }) {
        const cases: TCase[] = [
            { id: "all", name: "All Insights" },
            { id: EPredictionCase.OPTIMISTIC, name: "Bullish" },
            { id: EPredictionCase.PESSIMISTIC, name: "Bearish" },
            { id: EPredictionCase.BASELINE, name: "Neutral" },
        ];
        const [selectedCase, setSelectedCase] = useState<TCase | undefined>(
            cases[0]
        );

        const filteredItems = useMemo(() => {
            if (selectedCase?.id === "all") {
                return items;
            }
            return items?.filter((item) => item.case === selectedCase?.id);
        }, [items, selectedCase]);

        return (
            <>
                <div className="mx-2 border-b border-borderLine">
                    <div className="flex justify-between">
                        <CoinSelect
                            coins={supportedCoins}
                            selectedCoin={selectedMarket}
                            onSelect={onSelectMarket}
                        />
                        <CaseSelect
                            cases={cases}
                            selectedCase={selectedCase}
                            onSelect={setSelectedCase}
                        />
                    </div>
                </div>
                {isLoadingItems || !items ? (
                    <ModuleLoader $height={`${widgetHeight}px`} />
                ) : (
                    <KasandraItemList
                        timelineItems={filteredItems}
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
