import { FC } from "react";
import { CenteredBlock } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TPolymarketMarket,
    TPolymarketMarketGroup,
} from "src/api/services/polymarket/types";
import PolymarketTopVolumeCard from "./PolymarketTopVolumeCard";

export interface IPolymarketEvents {
    markets: TPolymarketMarketGroup["markets"];
    onSelectMarket: (market: TPolymarketMarket) => void;
    onSelectEvent: () => void;
}

const PolymarketEvents: FC<IPolymarketEvents> = ({
    markets,
    onSelectMarket,
    onSelectEvent,
}) => {
    const { t } = useTranslation();

    if (markets.length === 0) {
        return (
            <CenteredBlock>
                <p>{t("polymarket.noMarketsFound")}</p>
            </CenteredBlock>
        );
    }

    return (
        <div className="relative pl-10 pr-[2px]">
            {markets.slice(0, 3).map((market) => (
                <PolymarketTopVolumeCard
                    key={market.id}
                    market={market}
                    onSelectMarket={onSelectMarket}
                />
            ))}
            {markets.length > 3 && (
                <div className="-bottom-2 absolute -translate-x-1/2 left-1/2 flex items-center justify-center">
                    <button
                        type="button"
                        className="text-accentVariant100 px-2 bg-background"
                        onClick={() => onSelectEvent?.()}
                    >
                        {t("navigation.general.more")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PolymarketEvents;
