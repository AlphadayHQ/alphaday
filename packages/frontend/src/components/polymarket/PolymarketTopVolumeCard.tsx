import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TPolymarketMarket,
    TPolymarketMarketGroup,
} from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { ENumberStyle, formatNumber } from "src/api/utils/format";

interface IPolymarketTopVolumeCard {
    market: TPolymarketMarketGroup["markets"][0];
    onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketTopVolumeCard: FC<IPolymarketTopVolumeCard> = ({
    market,
    onSelectMarket,
}) => {
    const { t } = useTranslation();

    const endDate = market.endDate ? new Date(market.endDate) : null;
    const isExpired = endDate && endDate < new Date();

    let statusText = "";
    let statusColor = "";
    if (market.closed) {
        statusText = t("polymarket.resolved");
        statusColor = "text-gray-500";
    } else if (isExpired) {
        statusText = t("polymarket.expired");
        statusColor = "text-secondaryOrangeSoda";
    } else {
        statusText = t("polymarket.live");
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
                    <span className="line-clamp-2 fontGroup-normal">
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
                        {endDate && !market.closed && (
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
                                {market.outcomes.map((outcome, idx) => {
                                    const chance = Number.parseFloat(
                                        (outcome.price * 100).toPrecision(2)
                                    );
                                    const price = formatNumber({
                                        value: outcome.price,
                                        style: ENumberStyle.Currency,
                                        currency: "USD",
                                    }).value;
                                    //     = Number.parseFloat(
                                    //     outcome.price.toPrecision(2)
                                    // );
                                    return (
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
                                                {outcome.outcomeName}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0 fontGroup-normal">
                                                <span className="text-primary">
                                                    {Math.ceil(chance)}%
                                                </span>
                                                <span
                                                    className={twMerge(
                                                        t(
                                                            "ml-0.5 text-primary py-0.5 px-1 rounded-md fontGroup-supportBold"
                                                        ),
                                                        idx === 0 &&
                                                            "bg-blue-500/20",
                                                        idx === 1 &&
                                                            "bg-orange-400/20"
                                                    )}
                                                >
                                                    {price}
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
