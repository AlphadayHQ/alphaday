import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";

interface IPolymarketCard {
    market: TPolymarketMarket;
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketCard: FC<IPolymarketCard> = ({ market, onSelectMarket }) => {
    const { t } = useTranslation();

    const endDate = market.end_date ? new Date(market.end_date) : null;
    const isExpired = endDate && endDate < new Date();

    let statusText = "";
    let statusColor = "";
    if (market.resolved) {
        statusText = t("polymarket.resolved");
        statusColor = "text-gray-500";
    } else if (isExpired) {
        statusText = t("polymarket.expired");
        statusColor = "text-orange-500";
    } else {
        statusText = t("polymarket.active");
        statusColor = "text-green-500";
    }

    const formatVolume = (volume?: number) => {
        if (!volume) return "$0";
        if (volume >= 1000000) {
            return `$${(volume / 1000000).toFixed(1)}M`;
        }
        if (volume >= 1000) {
            return `$${(volume / 1000).toFixed(1)}K`;
        }
        return `$${volume.toLocaleString()}`;
    };

    const handleClick = () => {
        if (onSelectMarket) {
            onSelectMarket(market);
        }
    };

    return (
        <div
            className="bg-background border-b border-borderLine p-4 cursor-pointer hover:bg-backgroundVariant100 active:bg-backgroundVariant200 transition-all duration-200"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="flex items-center justify-between mb-1">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary line-clamp-2 leading-tight">
                    {market.image && (
                        <img
                            src={market.image}
                            alt="Market"
                            className="w-5 h-5 rounded-full object-cover"
                        />
                    )}
                    {market.question}
                </h3>
                <span className={twMerge("text-xs font-medium", statusColor)}>
                    {statusText}
                </span>
            </div>

            <div className="p-2">
                <div className="flex items-center justify-between mb-2 text-xs">
                    <div className="flex items-center gap-3">
                        <span className="font-medium">
                            {formatVolume(market.volume)}{" "}
                            {t("navigation.general.vol")}
                        </span>
                        {endDate && !market.resolved && (
                            <span className="text-primaryVariant100">
                                {computeDuration(endDate.toISOString())}
                            </span>
                        )}
                    </div>
                </div>
                {market.outcomes && market.outcomes.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        {market.outcomes.map((outcome) => (
                            <div
                                key={outcome.id}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-primaryVariant100 truncate">
                                    {outcome.outcome_name}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-primary">
                                        ${outcome.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolymarketCard;
