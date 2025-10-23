import { FC, FormEvent, useCallback } from "react";
import {
    CenteredBlock,
    ModuleLoader,
    ScrollBar,
    twMerge,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketEvent } from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import PolymarketEvents from "./PolymarketEvents";

export interface IPolymarketEventsModule {
    isLoading?: boolean;
    events: TPolymarketEvent[] | undefined;
    onSelectEvent: (event: TPolymarketEvent) => void;
    contentHeight: string;
    handlePaginate: (type: "next" | "previous") => void;
}

const PolymarketEventsModule: FC<IPolymarketEventsModule> = ({
    isLoading,
    events,
    onSelectEvent,
    contentHeight,
    handlePaginate,
}) => {
    const { t } = useTranslation();
    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

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

    const renderEvents = useCallback(
        () =>
            events?.map((event) => {
                // endDate it end date of furthest endDate in event.markets
                const endDate = event.markets?.reduce((max, market) => {
                    return Math.max(
                        max,
                        market.endDate ? new Date(market.endDate).getTime() : 0
                    );
                }, 0);
                const isAllMarketsClosed = event.markets?.every(
                    (market) => !market.active
                );

                let statusText = t("polymarket.live");
                let statusColor = "bg-success";
                if (isAllMarketsClosed) {
                    statusText = t("polymarket.resolved");
                    statusColor = "bg-gray-500";
                }
                return (
                    <div className="ml-2" role="button">
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
                        <PolymarketEvents
                            markets={event.markets}
                            onSelectMarket={() => onSelectEvent(event)}
                            onSelectEvent={() => onSelectEvent(event)}
                        />
                        <div className="w-full h-3" />
                    </div>
                );
            }),
        [events, t, onSelectEvent]
    );

    if (!events || isLoading) {
        return <ModuleLoader $height={contentHeight} />;
    }

    if (events.length === 0) {
        return (
            <CenteredBlock>
                <p>{globalMessages.queries.noMatchFound("markets")}</p>
            </CenteredBlock>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {isLoading ? (
                <ModuleLoader $height={contentHeight} />
            ) : (
                <ScrollBar onScroll={handleScroll}>{renderEvents()}</ScrollBar>
            )}
        </div>
    );
};

export default PolymarketEventsModule;
