import { FC } from "react";
import { ModuleLoader, twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TPolymarketMarketGroup,
    TPolymarketMarket,
} from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import PolymarketTopVolumeList from "./PolymarketTopVolumeList";

export interface IPolymarketTopVolumeModule {
    isLoading?: boolean;
    marketGroupData: TPolymarketMarketGroup | undefined;
    onSelectMarket?: (market: TPolymarketMarket) => void;
    contentHeight: string;
}

const PolymarketTopVolumeModule: FC<IPolymarketTopVolumeModule> = ({
    isLoading,
    marketGroupData,
    onSelectMarket,
    contentHeight,
}) => {
    const { t } = useTranslation();

    if (!marketGroupData) return null;

    // enddate it endate of furthest enddate in marketGroupData.markets
    const endDate = marketGroupData.markets.reduce((max, market) => {
        return Math.max(
            max,
            market.endDate ? new Date(market.endDate).getTime() : 0
        );
    }, 0);
    const isExpired = endDate ? new Date(endDate) < new Date() : false;
    // is all markets closed
    const isAllMarketsClosed = marketGroupData.markets.every(
        (market) => market.closed
    );

    let statusText = t("polymarket.live");
    let statusColor = "bg-success";
    if (isAllMarketsClosed) {
        statusText = t("polymarket.resolved");
        statusColor = "bg-gray-500";
    } else if (isExpired) {
        statusText = t("polymarket.expired");
        statusColor = "bg-secondaryOrangeSoda";
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

    return (
        <div className="flex flex-col h-full">
            {isLoading ? (
                <ModuleLoader $height={contentHeight} />
            ) : (
                <div className="h-full pb-14 ml-2" role="button">
                    <div className="flex items-center justify-between px-1 pb-2 mr-[3px]">
                        <div className="flex gap-4 w-full">
                            {marketGroupData.image && (
                                <img
                                    src={marketGroupData.image}
                                    alt="Market"
                                    className="w-8 h-8 mt-0.5 rounded-full object-cover self-start"
                                />
                            )}
                            <div className="flex flex-col gap-2 w-full">
                                <span className="line-clamp-2 fontGroup-highlight">
                                    {marketGroupData.title}
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
                                        {formatVolume(marketGroupData.volume)}{" "}
                                        {t("navigation.general.vol")}
                                    </span>
                                    {endDate &&
                                        !marketGroupData.markets.every(
                                            (market) => market.closed
                                        ) && (
                                            <>
                                                <span className="mx-[7px] my-0 self-center">
                                                    •
                                                </span>
                                                <span className="text-primaryVariant100">
                                                    {computeDuration(
                                                        new Date(
                                                            endDate
                                                        ).toISOString()
                                                    )}
                                                </span>
                                            </>
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <PolymarketTopVolumeList
                        markets={marketGroupData.markets}
                        onSelectMarket={onSelectMarket}
                    />
                    <div className="w-full h-10" />
                </div>
            )}
        </div>
    );
};

export default PolymarketTopVolumeModule;
