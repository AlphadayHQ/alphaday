import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { translateLabels } from "src/api/utils/translationUtils";

interface IPolymarketCard {
    market: TPolymarketMarket;
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketCard: FC<IPolymarketCard> = ({ market, onSelectMarket }) => {
    const { t } = useTranslation();

    const topOutcome =
        market.outcomes && market.outcomes.length > 0
            ? market.outcomes.reduce((prev, current) =>
                  prev.probability > current.probability ? prev : current
              )
            : null;

    const endDate = market.end_date ? new Date(market.end_date) : null;
    const isExpired = endDate && endDate < new Date();

    let statusText = "";
    let statusColor = "";
    if (market.resolved) {
        statusText = t("Resolved");
        statusColor = "text-gray-500";
    } else if (isExpired) {
        statusText = t("Expired");
        statusColor = "text-orange-500";
    } else {
        statusText = t("Active");
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
            <div className="flex items-center justify-between mb-3">
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

            {topOutcome && (
                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <span className="font-medium">
                                {formatVolume(market.total_volume)}{" "}
                                {translateLabels("vol")}
                            </span>
                            {endDate && !market.resolved && (
                                <span>
                                    {computeDuration(endDate.toISOString())}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="text-xs text-primaryVariant100 font-medium">
                                {topOutcome.name}
                            </span>
                            <span className="text-xs font-bold text-primary">
                                {Math.round(
                                    (topOutcome.probability || 0) * 100
                                )}
                                %
                            </span>
                            <span className="text-xs text-primaryVariant100">
                                ${topOutcome.price.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    {market.outcomes && market.outcomes.length >= 2 && (
                        <div className="flex flex-col gap-2 mt-2 text-primaryVariant100">
                            {market.outcomes.map((outcome) => (
                                <div className="text-primaryVariant100">
                                    {outcome.name ?? outcome.price}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PolymarketCard;
