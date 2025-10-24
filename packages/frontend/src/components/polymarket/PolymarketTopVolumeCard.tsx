import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TPolymarketMarket,
    TPolymarketMarketGroup,
} from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";

interface IPolymarketTopVolumeCard {
    market: TPolymarketMarketGroup["markets"][0];
    isSingleMarket?: boolean;
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketTopVolumeCard: FC<IPolymarketTopVolumeCard> = ({
    market,
    onSelectMarket,
    isSingleMarket,
}) => {
    const { t } = useTranslation();

    const endDate = market.endDate ? new Date(market.endDate) : null;

    let statusText = "";
    let statusColor = "";
    if (market.closed) {
        statusText = t("polymarket.resolved");
        statusColor = "bg-gray-500";
    } else {
        statusText = t("polymarket.live");
        statusColor = "bg-success";
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
            // TODO(xavier-charles): fix this
            // @ts-ignore
            onSelectMarket(market as TPolymarketMarket);
        }
    };

    return (
        <div
            className="bg-background border-b border-borderLine py-3 pl-3 pr-1 cursor-pointer hover:bg-backgroundVariant100 active:bg-backgroundVariant200 transition-all duration-200"
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
                <div className="flex flex-col gap-2 w-full">
                    {isSingleMarket !== true && (
                        <>
                            {" "}
                            <span className="line-clamp-2 fontGroup-normal">
                                {market.question}
                            </span>
                            <p className="fontGroup-mini mb-0">
                                <span
                                    className={twMerge(
                                        "fontGroup-supportBold lastLine px-1 text-background rounded-sm",
                                        statusColor
                                    )}
                                >
                                    {statusText}
                                </span>
                                <span className="mx-[7px] my-0 self-center">
                                    •
                                </span>
                                <span>
                                    {formatVolume(market.volume)}{" "}
                                    {t("navigation.general.vol")}
                                </span>
                                {endDate && !market.closed && (
                                    <>
                                        <span className="mx-[7px] my-0 self-center">
                                            •
                                        </span>
                                        <span className="text-primaryVariant100">
                                            {computeDuration(
                                                endDate.toISOString()
                                            )}
                                        </span>
                                    </>
                                )}
                            </p>
                        </>
                    )}
                    <div className="">
                        {market.outcomes && market.outcomes.length > 0 && (
                            <div className="flex flex-col gap-1">
                                {market.outcomes.map((outcome, idx) => {
                                    const chance = Number.parseFloat(
                                        (outcome.price * 100).toPrecision(2)
                                    );
                                    let barWidth;
                                    if (chance === 0) {
                                        barWidth = 0;
                                    } else if (chance < 2) {
                                        barWidth = 2;
                                    } else {
                                        barWidth = chance;
                                    }
                                    return (
                                        <div
                                            key={outcome.id}
                                            className={twMerge(
                                                "relative flex items-center justify-between text-xs bg-gray-500/20 [&>span]:text-primaryVariant100 py-1.5 px-2",
                                                idx === 0 &&
                                                    `rounded-t-md ${market.outcomes?.length === 2 ? "bg-blue-500/20 [&>span]:text-accentVariant100" : ""}`,

                                                idx === 1 &&
                                                    `rounded-b-md ${market.outcomes?.length === 2 ? "bg-orange-400/20 [&>span]:text-secondaryOrange" : ""}`
                                            )}
                                        >
                                            <div
                                                style={{
                                                    width: `${barWidth}%`,
                                                }}
                                                className={twMerge(
                                                    "absolute left-0 h-full w-full bg-red-500/25",
                                                    idx === 0 &&
                                                        "bg-blue-500/20 rounded-tl-md",
                                                    idx === 1 &&
                                                        "bg-orange-500/20 rounded-bl-md"
                                                )}
                                            />
                                            <span className="text-blue-600 fontGroup-highlightSemi truncate">
                                                {outcome.outcomeName}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0 fontGroup-normal">
                                                <span className="text-primary">
                                                    {Math.ceil(chance)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolymarketTopVolumeCard;
