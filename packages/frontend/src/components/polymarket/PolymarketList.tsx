import { FC } from "react";
import { CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import PolymarketCard from "./PolymarketCard";

export interface IPolymarketList {
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketList: FC<IPolymarketList> = ({ markets, onSelectMarket }) => {
    const { t } = useTranslation();

    if (markets.length === 0) {
        return (
            <CenteredBlock>
                <p>{t("No markets found")}</p>
            </CenteredBlock>
        );
    }

    return (
        <ScrollBar>
            {markets.map((market) => (
                <PolymarketCard
                    key={market.id}
                    market={market}
                    onSelectMarket={onSelectMarket}
                />
            ))}
        </ScrollBar>
    );
};

export default PolymarketList;
