import { FC, useState } from "react";
import { ModuleLoader, TabButton } from "@alphaday/ui-kit";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { translateLabels } from "src/api/utils/translationUtils";
import PolymarketList from "./PolymarketList";
import { EPolymarketFilter } from "./types";

export interface IPolymarketModule {
    isLoading?: boolean;
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
    contentHeight: string;
}

const PolymarketModule: FC<IPolymarketModule> = ({
    isLoading,
    markets,
    onSelectMarket,
    contentHeight,
}) => {
    const [currentFilter, setCurrentFilter] = useState<EPolymarketFilter>(
        EPolymarketFilter.Active
    );

    if (isLoading) {
        return <ModuleLoader $height={contentHeight} />;
    }

    const filteredMarkets = markets.filter((market) => {
        switch (currentFilter) {
            case EPolymarketFilter.Active:
                return !market.resolved;
            case EPolymarketFilter.Resolved:
                return market.resolved;
            default:
                return true;
        }
    });

    const handleFilterChange = (filter: EPolymarketFilter) => {
        setCurrentFilter(filter);
    };

    return (
        <div className="flex flex-col h-full pb-4">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-borderLine">
                <div className="flex items-center gap-2">
                    <TabButton
                        variant="small"
                        open={currentFilter === EPolymarketFilter.All}
                        onClick={() =>
                            handleFilterChange(EPolymarketFilter.All)
                        }
                    >
                        {translateLabels("All")}
                    </TabButton>
                    <TabButton
                        variant="small"
                        open={currentFilter === EPolymarketFilter.Active}
                        onClick={() =>
                            handleFilterChange(EPolymarketFilter.Active)
                        }
                    >
                        {translateLabels("Active")}
                    </TabButton>
                    <TabButton
                        variant="small"
                        open={currentFilter === EPolymarketFilter.Resolved}
                        onClick={() =>
                            handleFilterChange(EPolymarketFilter.Resolved)
                        }
                    >
                        {translateLabels("Resolved")}
                    </TabButton>
                </div>
            </div>

            <PolymarketList
                markets={filteredMarkets}
                onSelectMarket={onSelectMarket}
            />
        </div>
    );
};

export default PolymarketModule;
