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
        statusColor = "text-secondaryOrangeSoda";
    } else {
        statusText = t("polymarket.active");
        statusColor = "text-success";
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
            className="bg-background border-b border-borderLine py-3 px-1 ml-2 mr-[3px] cursor-pointer hover:bg-backgroundVariant100 active:bg-backgroundVariant200 transition-all duration-200"
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
            <div className="flex items-center justify-between">
                <div className="flex gap-4 w-full">
                    {market.image && (
                        <img
                            src={market.image}
                            alt="Market"
                            className="w-8 h-8 mt-0.5 rounded-full object-cover self-start"
                        />
                    )}
                    <div className="flex flex-col gap-2 w-full">
                        <span className="line-clamp-2 fontGroup-highlight">
                            {market.question}
                        </span>
                        <p className="fontGroup-mini mb-0">
                            <span
                                className={twMerge(
                                    "fontGroup-mini lastLine",
                                    statusColor
                                )}
                            >
                                {statusText}
                            </span>
                            <span className="mx-[7px] my-0 self-center">•</span>
                            <span>
                                {formatVolume(market.volume)}{" "}
                                {t("navigation.general.vol")}
                            </span>
                            {endDate && !market.resolved && (
                                <>
                                    <span className="mx-[7px] my-0 self-center">
                                        •
                                    </span>
                                    <span className="text-primaryVariant100">
                                        {computeDuration(endDate.toISOString())}
                                    </span>
                                </>
                            )}
                        </p>
                        <div className="">
                            {market.outcomes && market.outcomes.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    {market.outcomes.map((outcome, idx) => (
                                        <div
                                            key={outcome.id}
                                            className={twMerge(
                                                "flex items-center justify-between text-xs bg-gray-500/20 [&>span]:text-primaryVariant100 py-1.5 px-2",
                                                idx === 0 &&
                                                    `rounded-t-md ${market.outcomes?.length === 2 ? "bg-blue-500/20 [&>span]:text-accentVariant100" : ""}`,

                                                idx === 1 &&
                                                    `rounded-b-md ${market.outcomes?.length === 2 ? "bg-orange-400/20 [&>span]:text-secondaryOrange" : ""}`
                                            )}
                                        >
                                            <span className="text-blue-600 fontGroup-highlightSemi truncate">
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
                </div>
            </div>
        </div>
    );
};

export default PolymarketCard;
