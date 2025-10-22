import { FC, useMemo, useCallback, Suspense, useState, useEffect } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import { useGetPolymarketEventsQuery } from "src/api/services";
import type { TPolymarketEvent } from "src/api/services/polymarket/types";
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
        currentData: eventsData,
        isLoading: isLoadingEvents,
        isSuccess,
    } = useGetPolymarketEventsQuery(
        {
            page: currentPage,
            limit: CONFIG.API.DEFAULT.DEFAULT_PARAMS.RESPONSE_LIMIT,
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

    // Reset events when tags change
    useEffect(() => {
        if (tagsString !== undefined) {
            setEvents(undefined);
            setCurrentPage(undefined);
        }
    }, [tagsString]);

    const handleSelectEvent = useCallback(
        (event: TPolymarketEvent) => {
            logButtonClicked({
                buttonName: "polymarket-event",
                data: {
                    widgetName: moduleData.name,
                    eventId: event.id,
                    eventTitle: event.title,
                },
            });
            window.open(event.url, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, moduleData.name]
    );

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketEventsModule
                isLoading={isLoadingEvents || eventsData?.results === undefined}
                events={events || eventsData?.results || []}
                onSelectEvent={handleSelectEvent}
                contentHeight={contentHeight}
                handlePaginate={handleNextPage}
            />
        </Suspense>
    );
};

export default PolymarketEventsContainer;
