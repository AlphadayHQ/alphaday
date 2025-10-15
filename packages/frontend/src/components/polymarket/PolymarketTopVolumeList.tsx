import { FC } from "react";
import { CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TPolymarketMarket,
    TPolymarketMarketGroup,
} from "src/api/services/polymarket/types";
import PolymarketTopVolumeCard from "./PolymarketTopVolumeCard";

export interface IPolymarketList {
    markets: TPolymarketMarketGroup["markets"];
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketList: FC<IPolymarketList> = ({ markets, onSelectMarket }) => {
    const { t } = useTranslation();

    if (markets.length === 0) {
        return (
            <CenteredBlock>
                <p>{t("polymarket.noMarketsFound")}</p>
            </CenteredBlock>
        );
    }

    return (
        <ScrollBar>
            {markets.map((market) => (
                <PolymarketTopVolumeCard
                    key={market.id}
                    market={market}
                    onSelectMarket={onSelectMarket}
                />
            ))}
        </ScrollBar>
    );
};

export default PolymarketList;
