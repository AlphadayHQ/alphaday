import { FC, useCallback, useMemo, useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { useWidgetHeight } from "src/api/hooks";
import { useSelectedDate } from "src/api/hooks/useSelectedDate";
import {
    EWidgetData,
    useGetEventQuery,
    useGetEventsQuery,
    TGetEventResponse,
} from "src/api/services";
import {
    selectSelectedCalendarType,
    setEventFilters,
    setSelectedCalendarType,
    selectedViewSelector,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TEvent } from "src/api/types";
import { getClosestEvent } from "src/api/utils/calendarUtils";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { customDataAsItems } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { buildViewPath } from "src/api/utils/viewUtils";
import CalendarModule from "src/components/calendar/CalendarModule";
import { ECalendarType } from "src/components/calendar/types";
import {
    defaultEventCategory,
    viewableCategories,
} from "src/components/calendarCategories";
import { TEventCategory } from "src/components/types";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer, TCategoryData } from "src/types";
import CONFIG from "../../config/config";

const { POLLING_INTERVAL, QUERY_EVENTS_HARD_LIMIT } = CONFIG.WIDGETS.CALENDAR;

/**
 * @param eventIdFromPath The event id from the current URL path
 * @param selectedEventDetailsResponse The event details as returned by the backend
 * @param selectedDate The selected date in the calendar
 * @returns true if the selected date is not within the range of the current event id
 */
const shouldChangeSelectedDate = (
    eventIdFromPath: string | undefined,
    selectedEventDetailsResponse: TGetEventResponse | undefined,
    selectedDate: Date
): boolean => {
    if (
        eventIdFromPath !== undefined &&
        eventIdFromPath === selectedEventDetailsResponse?.result.id
    ) {
        // trigger query to get other events in the same month as the event with id eventId
        const { start, end } = selectedEventDetailsResponse.result;

        if (moment(selectedDate).isSame(moment(start))) return false;

        // Do not change the selectedDate if it is within the range of the selected Event.
        if (moment(selectedDate).isBetween(moment(start), moment(end))) {
            return false;
        }
        return true;
    }
    return false;
};

const fetchCalendarEvents = (_date: Date): void => undefined;

const CalendarContainer: FC<IModuleContainer<TCategoryData[][]>> = ({
    moduleData,
    showFullSize,
    toggleAdjustable,
}) => {
    const navigate = useHistory();
    const params = useParams<{ eventId: string }>();
    const dispatch = useAppDispatch();

    const selectedView = useAppSelector(selectedViewSelector);

    const viewPath = buildViewPath(selectedView?.data);

    const widgetCats = customDataAsItems(moduleData.widget.custom_data ?? []);

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyWidgetCats = moduleData.widget.format_structure?.data?.[0];
    if (Array.isArray(legacyWidgetCats) && legacyWidgetCats.length > 0) {
        Logger.warn(
            `CalendarContainer: widget ${moduleData.widget.name} is using format_structure which has been deprecated`
        );
    }

    const allowedCategories: TEventCategory[] =
        widgetCats?.map((wCat) => {
            const vCat =
                viewableCategories.find((cat) => cat.value === wCat.name) ||
                defaultEventCategory;
            return {
                ...wCat,
                value: vCat?.value,
                label: wCat?.description,
                category: wCat?.description,
                color: vCat?.color,
            };
        }) || [];

    const widgetHeight = useWidgetHeight(moduleData);

    const eventFilters = useAppSelector(
        (state) =>
            state.widgets.calendar[moduleData.hash]?.eventFilters ??
            allowedCategories
    );

    const { selectedDate: storedDate, setSelectedDate: setStoredDate } =
        useSelectedDate(moduleData.hash);

    const storedCalType = useAppSelector(
        selectSelectedCalendarType(moduleData.hash)
    );

    const defaultCalenderType =
        storedCalType ||
        (moduleData.widget?.data_type === EWidgetData.Static
            ? ECalendarType.List
            : ECalendarType.Month); // Change the default CalType to based on the widget's data_type

    const [calendarType, setCalendarType] =
        useState<ECalendarType>(defaultCalenderType);

    const handleCalType = useCallback(
        (calType: ECalendarType) => {
            setCalendarType(calType);

            dispatch(
                setSelectedCalendarType({
                    calType,
                    widgetHash: moduleData.hash,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const switchCalendarType = useCallback(() => {
        if (calendarType === ECalendarType.Month) {
            handleCalType(ECalendarType.List);
            toggleAdjustable();
        }
        if (calendarType === ECalendarType.List) {
            handleCalType(ECalendarType.Month);
        }
    }, [calendarType, handleCalType, toggleAdjustable]);

    const [selectedDate, setSelectedDate] = useState<Date>(storedDate);

    const handleSelectedDate = useCallback(
        (date: Date) => {
            if (+selectedDate !== +date) {
                setSelectedDate(date);
                setStoredDate(date);
            }
        },
        [selectedDate, setStoredDate]
    );

    const tagsSettings = moduleData.settings.filter(
        (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval || POLLING_INTERVAL) * 1000;

    const {
        data: eventsData,
        isLoading: isLoadingEvents,
        isFetching: isFetchingEvents,
    } = useGetEventsQuery(
        {
            period_after: moment(selectedDate)
                .startOf("month")
                .subtract(1, "month")
                .format("YYYY-MM-DD"),
            period_before: moment(selectedDate)
                .startOf("month")
                .add(1, "month")
                .format("YYYY-MM-DD"),
            limit: QUERY_EVENTS_HARD_LIMIT,
            tags: tags ? filteringListToStr(tags) : undefined,
        },
        { skip: !selectedDate, pollingInterval }
    );

    const closestEvent: TEvent | undefined = useMemo(
        () => getClosestEvent(eventsData?.results, selectedDate),
        [eventsData?.results, selectedDate]
    );

    const {
        currentData: eventDetailsData,
        isFetching: isFetchingEventDetails,
    } = useGetEventQuery(
        {
            id: params.eventId ? params.eventId : closestEvent?.id || "",
        },
        {
            skip: !selectedDate || !(params.eventId || closestEvent?.id),
        }
    );
    const onClickEvent = (
        eventId: string,
        eventUrlTitle: string,
        eventStart: string
    ): void => {
        setSelectedDate(new Date(eventStart));
        /**
         * When a view is stale, it can be removed and re-added to the cache,
         * so selectedView can be undefined for a transient interval
         */
        if (viewPath === "/" || selectedView === undefined) return;
        navigate.push(`${viewPath}calendar/event/${eventId}/${eventUrlTitle}`);
        Logger.debug("onClickEvent", eventId, eventUrlTitle);
    };

    const onDatesSet = useCallback(
        (dateStr: string) => {
            /**
             * This function is used to change the selectedDate when the user
             * changes the view (current month) the calendar.
             *
             * It sets the selectedDate to the first day of the month.
             *
             * If the current selectedDate  is not  from the same month as dateStr,
             * it sets the selectedDate to the same day as dateStr.
             *
             * Could be refactored to handle week view change as well when we need it.
             */
            if (
                !moment(new Date(dateStr)).isSame(moment(selectedDate), "month")
            ) {
                handleSelectedDate(new Date(dateStr));
                /**
                 * onDatesSet is called only when the user changes the view (month)
                 *
                 * If the user changes the month there is (technically) no
                 * selectedDate (except the one we set by default).
                 * So we navigate to the calendar.
                 */
                if (params.eventId && viewPath !== "/") {
                    navigate.push(`${viewPath}calendar/`);
                }
            }
        },
        [handleSelectedDate, navigate, params, selectedDate, viewPath]
    );

    const handleCatFilters = useCallback(
        (eFilters: TEventCategory[]) => {
            dispatch(
                setEventFilters({
                    filters: eFilters,
                    widgetHash: moduleData.hash,
                })
            );
        },
        [moduleData.hash, dispatch]
    );

    const { eventId } = params;
    if (
        eventDetailsData !== undefined &&
        shouldChangeSelectedDate(eventId, eventDetailsData, selectedDate)
    ) {
        const { start } = eventDetailsData.result;
        setSelectedDate(new Date(String(start)));
    }

    useEffect(() => {
        /**
         * This effect is included so as to run only once
         * and that's on mount when `defaultCalenderType` is initialized
         *
         * However, in the scenario that we update a widget from admin,
         * this effect would rerun as well
         */
        if (defaultCalenderType === ECalendarType.Month) {
            toggleAdjustable();
        }
    }, [defaultCalenderType, toggleAdjustable]);
    /**
     * the "loading" state of the event details component is determined as follows:
     * - When we are passing the eventId, we just read `isFetchingEventDetails` because
     *   the query is triggered immediately.
     * - When there is no eventId, we need to find the closest event. During that
     *   time, we need to fetch the event list (`eventData`) first, so there is a transient state
     *   in which both `eventDetailsData = undefined && isFetchingEventDetails = false`. After that,
     *   the query is triggered.
     */
    const isLoadingEventDetails = eventId
        ? isFetchingEventDetails
        : isFetchingEvents || isFetchingEventDetails;

    return (
        <CalendarModule
            events={eventsData?.results}
            fetchEvents={fetchCalendarEvents}
            onClickEvent={onClickEvent}
            onDatesSet={onDatesSet}
            selectedEventDetails={eventDetailsData?.result}
            isLoadingEventDetails={isLoadingEventDetails}
            selectedDate={selectedDate}
            showFullSize={showFullSize}
            calendarType={calendarType}
            switchCalendarType={switchCalendarType}
            widgetHash={moduleData.hash}
            catFilters={eventFilters}
            setCatFilters={handleCatFilters}
            widgetHeight={widgetHeight}
            allowedCategories={allowedCategories}
            isLoadingEvents={isLoadingEvents}
            isFetchingEvents={isFetchingEvents}
        />
    );
};

export default CalendarContainer;
