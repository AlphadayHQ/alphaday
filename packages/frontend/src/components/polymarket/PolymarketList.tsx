import { FC, FormEvent } from "react";
import { CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import PolymarketCard from "./PolymarketCard";

export interface IPolymarketList {
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
    handlePaginate: (type: "next" | "previous") => void;
}

const PolymarketList: FC<IPolymarketList> = ({
    markets,
    onSelectMarket,
    handlePaginate,
}) => {
    const { t } = useTranslation();

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    if (markets.length === 0) {
        return (
            <CenteredBlock>
                <p>{t("polymarket.noMarketsFound")}</p>
            </CenteredBlock>
        );
    }

    return (
        <ScrollBar onScroll={handleListScroll}>
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
