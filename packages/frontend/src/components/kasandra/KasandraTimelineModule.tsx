import { FC, memo, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import {
    EItemFeedPreference,
    TCoin,
    TInsightItem,
    TKasandraCase,
} from "src/api/types";
import { TMarketMeta } from "../market/types";
import { CaseSelect } from "./CaseSelect";
import { CoinSelect } from "./CoinSelect";
import KasandraItemList from "./KasandraItemList";

interface IKasandra {
    items: TInsightItem[] | undefined;
    selectedMarket: TCoin | undefined;
    isLoadingItems: boolean;
    feedPreference: EItemFeedPreference;
    onSetFeedPreference: (preference: EItemFeedPreference) => void;
    supportedCoins: TCoin[];
    onSelectMarket: (market: TMarketMeta) => void;
    widgetHeight: number;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TInsightItem) => MaybeAsync<void>;
    isAuthenticated: boolean;
    selectedCase: TKasandraCase;
    onSelectCase: (kase: TKasandraCase) => void;
    selectedTimestamp: number | undefined;
    onSelectDataPoint: (timestamp: number) => void;
}

const KasandraTimelineModule: FC<IKasandra> = memo(
    function KasandraTimelineModule({
        items,
        isLoadingItems,
        widgetHeight,
        onClick,
        selectedTimestamp,
        selectedCase,
        onSelectCase,
        onSelectDataPoint,
        selectedMarket,
        supportedCoins,
        onSelectMarket,
    }) {
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
                            selectedCase={selectedCase}
                            onSelect={onSelectCase}
                        />
                    </div>
                </div>
                {isLoadingItems || !items ? (
                    <ModuleLoader $height={`${widgetHeight}px`} />
                ) : (
                    <KasandraItemList
                        timelineItems={filteredItems}
                        onClick={onClick}
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
