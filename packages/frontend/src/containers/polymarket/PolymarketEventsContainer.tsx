import { FC, useMemo, useCallback, Suspense, useState, useEffect } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import { useGetPolymarketEventsQuery } from "src/api/services";
import type {
    TPolymarketEvent,
    TPolymarketMarket,
} from "src/api/services/polymarket/types";
import { useAppSelector } from "src/api/store/hooks";
import { selectPolymarketFilter } from "src/api/store/slices/widgets";
import * as filterUtils from "src/api/utils/filterUtils";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import PolymarketEventsModule from "src/components/polymarket/PolymarketEventsModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const PolymarketEventsContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);
    const { logButtonClicked } = useCustomAnalytics();

    const selectedFilter = useAppSelector(
        selectPolymarketFilter(moduleData.hash)
    );

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );
    const [events, setEvents] = useState<TPolymarketEvent[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const tagsString = useMemo(
        () => (tags ? filterUtils.filteringListToStr(tags) : undefined),
        [tags]
    );

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.POLYMARKET_EVENTS.POLLING_INTERVAL) * 1000;

    const {
        data: eventsData,
        isLoading: isLoadingEvents,
        isSuccess,
    } = useGetPolymarketEventsQuery(
        {
            page: currentPage,
            limit: 10,
            active: true,
            tags: tagsString,
            ordering: "-volume_num", // Order by volume descending
        },
        {
            pollingInterval,
        }
    );

    useEffect(() => {
        const data = eventsData?.results;
        if (data !== undefined) {
            setEvents((prevEvents) => {
                if (prevEvents) {
                    return buildUniqueItemList([...prevEvents, ...data]);
                }
                return data;
            });
        }
    }, [eventsData?.results]);

    const { nextPage, handleNextPage } = usePagination(
        eventsData?.links,
        CONFIG.WIDGETS.POLYMARKET_EVENTS.MAX_PAGE_NUMBER,
        isSuccess
    );

    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    // Reset markets when selected filter or tags change
    useEffect(() => {
        if (selectedFilter !== undefined || tagsString !== undefined) {
            setEvents(undefined);
            setCurrentPage(undefined);
        }
    }, [selectedFilter, tagsString]);

    const handleSelectMarket = useCallback(
        (market: TPolymarketMarket) => {
            logButtonClicked({
                buttonName: "polymarket-top-volume",
                data: {
                    widgetName: moduleData.name,
                    marketId: market.id,
                    question: market.question,
                },
            });
            window.open(market.url, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, moduleData.name]
    );

    const handleSelectEvent = useCallback(
        (event: TPolymarketEvent) => {
            logButtonClicked({
                buttonName: "polymarket-event",
                data: {
                    widgetName: moduleData.name,
                    eventId: event.id,
                },
            });
        },
        [logButtonClicked, moduleData.name]
    );

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketEventsModule
                isLoading={isLoadingEvents}
                eventsData={events}
                onSelectEvent={handleSelectEvent}
                onSelectMarket={handleSelectMarket}
                contentHeight={contentHeight}
                handlePaginate={handleNextPage}
            />
        </Suspense>
    );
};

export default PolymarketEventsContainer;
