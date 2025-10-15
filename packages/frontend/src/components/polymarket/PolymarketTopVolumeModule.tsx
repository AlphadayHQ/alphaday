import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import {
    TPolymarketMarketGroup,
    TPolymarketMarket,
} from "src/api/services/polymarket/types";
import PolymarketTopVolumeList from "./PolymarketTopVolumeList";
import { EPolymarketFilter } from "./types";

export interface IPolymarketTopVolumeModule {
    isLoading?: boolean;
    marketGroupData: TPolymarketMarketGroup | undefined;
    onSelectMarket?: (market: TPolymarketMarket) => void;
    contentHeight: string;
    selectedFilter: EPolymarketFilter;
}

const PolymarketTopVolumeModule: FC<IPolymarketTopVolumeModule> = ({
    isLoading,
    marketGroupData,
    onSelectMarket,
    contentHeight,
    selectedFilter,
}) => {
    if (!marketGroupData) return null;

    const filteredMarkets = marketGroupData.markets.filter((market) => {
        switch (selectedFilter) {
            case EPolymarketFilter.Active:
                return !market.closed;
            case EPolymarketFilter.Resolved:
                return market.closed;
            default:
                return true;
        }
    });

    return (
        <div className="flex flex-col h-full pb-4">
            {isLoading ? (
                <ModuleLoader $height={contentHeight} />
            ) : (
                <PolymarketTopVolumeList
                    markets={filteredMarkets}
                    onSelectMarket={onSelectMarket}
                />
            )}
        </div>
    );
};

export default PolymarketTopVolumeModule;
