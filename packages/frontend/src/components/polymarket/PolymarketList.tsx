import { FC } from "react";
import { CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import PolymarketCard from "./PolymarketCard";

export interface IPolymarketList {
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketList: FC<IPolymarketList> = ({ markets, onSelectMarket }) => {
    if (markets.length === 0) {
        return (
            <CenteredBlock>
                <p>No markets found</p>
            </CenteredBlock>
        );
    }

    return (
        <ScrollBar>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {markets.map((market) => (
                    <PolymarketCard
                        key={market.id}
                        market={market}
                        onSelectMarket={onSelectMarket}
                    />
                ))}
            </div>
        </ScrollBar>
    );
};

export default PolymarketList;
