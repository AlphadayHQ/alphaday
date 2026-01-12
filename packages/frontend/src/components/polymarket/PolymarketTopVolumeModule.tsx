import { FC } from "react";
import { CenteredBlock, ModuleLoader, twMerge } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketEvent } from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import globalMessages from "src/globalMessages";
import PolymarketTopVolumeList from "./PolymarketTopVolumeList";

export interface IPolymarketTopVolumeModule {
    isLoading?: boolean;
    event: TPolymarketEvent | undefined;
    onSelectMarket?: (market: TPolymarketEvent["markets"][0]) => void;
    contentHeight: string;
}

const PolymarketTopVolumeModule: FC<IPolymarketTopVolumeModule> = ({
    isLoading,
    event,
    onSelectMarket,
    contentHeight,
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <ModuleLoader $height={contentHeight} />;
    }

    if (!event || event.markets.length === 0) {
        return (
            <CenteredBlock>
                <p>{globalMessages.queries.noMatchFound("markets")}</p>
            </CenteredBlock>
        );
    }

    // enddate it endate of furthest enddate in marketGroupData.markets
    const endDate = event.markets.reduce((max, market) => {
        return Math.max(
            max,
            market.endDate ? new Date(market.endDate).getTime() : 0
        );
    }, 0);
    const isExpired = endDate ? new Date(endDate) < new Date() : false;
    // is all markets closed
    const isAllMarketsClosed = event.markets.every((market) => market.closed);

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
        <div className="flex flex-col h-full mt-2 two-col:mt-0">
            <div className="h-full pb-14 ml-2" role="button">
                <div className="flex items-center justify-between px-1 pb-2 mr-[3px]">
                    <div className="flex gap-4 w-full">
                        {event.image && (
                            <img
                                src={event.image}
                                alt="Market"
                                className="w-8 h-8 mt-0.5 rounded-full object-cover self-start"
                            />
                        )}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="line-clamp-2 fontGroup-highlight">
                                {event.title}
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
                                    {formatVolume(event.volume)}{" "}
                                    {t("navigation.general.vol")}
                                </span>
                                {endDate &&
                                    !event.markets.every(
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
                    markets={event.markets}
                    onSelectMarket={onSelectMarket}
                />
                <div className="w-full h-10" />
            </div>
        </div>
    );
};

export default PolymarketTopVolumeModule;
