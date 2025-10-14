import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import PolymarketList from "./PolymarketList";
import { EPolymarketFilter } from "./types";

export interface IPolymarketModule {
    isLoading?: boolean;
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
    contentHeight: string;
    selectedFilter: EPolymarketFilter;
    handlePaginate: (type: "next" | "previous") => void;
}

const PolymarketModule: FC<IPolymarketModule> = ({
    isLoading,
    markets,
    onSelectMarket,
    contentHeight,
    selectedFilter,
    handlePaginate,
}) => {
    const filteredMarkets = markets.filter((market) => {
        switch (selectedFilter) {
            case EPolymarketFilter.Active:
                return !market.resolved;
            case EPolymarketFilter.Resolved:
                return market.resolved;
            default:
                return true;
        }
    });

    return (
        <div className="flex flex-col h-full pb-4">
            {isLoading ? (
                <ModuleLoader $height={contentHeight} />
            ) : (
                <PolymarketList
                    markets={filteredMarkets}
                    onSelectMarket={onSelectMarket}
                    handlePaginate={handlePaginate}
                />
            )}
        </div>
    );
};

export default PolymarketModule;
