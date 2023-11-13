import { FC, useCallback, useEffect, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TEvent } from "src/api/types";
import { defaultEventCategory } from "../calendarCategories";
import { TEventCategory } from "../types";
import CalendarFull from "./calendar-full/CalendarFull";
import CalendarList from "./CalendarList";
import CalendarMonth from "./CalendarMonth";
import { ECalendarType, ICalendarBaseProps } from "./types";

const CalendarModule: FC<ICalendarBaseProps> = ({
    events,
    isLoadingEvents,
    fetchEvents,
    onClickEvent,
    onDatesSet,
    selectedEventDetails,
    isLoadingEventDetails,
    selectedDate,
    calendarType,
    switchCalendarType,
    widgetHash,
    catFilters,
    setCatFilters,
    widgetHeight,
    allowedCategories,
    showFullSize,
}) => {
    const [eventsList, setEventsList] = useState<TEvent[] | undefined>(events);
    const [showAllFilters, setAllFilters] = useState(
        allowedCategories.every((cat) =>
            catFilters.some((filter) => filter.value === cat.value)
        )
    );

    const handleCatFilter = useCallback(
        (filters: TEventCategory[]) => {
            let newFilters = [...catFilters];
            filters.forEach((filter) => {
                if (newFilters.some((cat) => cat.value === filter.value)) {
                    newFilters = newFilters.filter(
                        (cat) => cat.value !== filter.value
                    );
                } else newFilters.push(filter);
            });
            setCatFilters(newFilters);
        },
        [catFilters, setCatFilters]
    );

    const toggleAllFilters = useCallback(() => {
        if (showAllFilters) setCatFilters([]);
        else setCatFilters(allowedCategories);
        setAllFilters((prev) => !prev);
    }, [allowedCategories, setCatFilters, showAllFilters]);

    useEffect(() => {
        const filters = catFilters?.map((f) => String(f.value).toLowerCase());
        if (filters && events) {
            setEventsList(
                events.filter(
                    (ev) =>
                        filters.includes(String(ev.type).toLowerCase()) &&
                        String(ev.type).toLowerCase() !==
                            defaultEventCategory.value.toLowerCase()
                )
            );
        }
    }, [catFilters, events]);

    const renderCalendar = () => {
        /**
         * since `events` is read from query `data` and not from `currentData`,
         * this condition will prevent the spinner to be displayed *every* time
         * isLoadingEvents is true.
         */
        if (events === undefined && isLoadingEvents) {
            return <ModuleLoader $height={`${widgetHeight}px`} />;
        }
        if (showFullSize) {
            return (
                <CalendarFull
                    events={eventsList}
                    fetchEvents={fetchEvents}
                    onClickEvent={onClickEvent}
                    onDatesSet={onDatesSet}
                    calendarType={calendarType}
                    switchCalendarType={switchCalendarType}
                    setCatFilters={handleCatFilter}
                    catFilters={catFilters}
                    selectedEventDetails={selectedEventDetails}
                    isLoadingEventDetails={isLoadingEventDetails}
                    selectedDate={selectedDate}
                    widgetHash={widgetHash}
                    toggleAllFilters={toggleAllFilters}
                    showAllFilters={showAllFilters}
                    allowedCategories={allowedCategories}
                    isLoadingEvents={isLoadingEvents}
                />
            );
        }
        if (calendarType === ECalendarType.List) {
            return (
                <CalendarList
                    events={eventsList}
                    fetchEvents={fetchEvents}
                    onClickEvent={onClickEvent}
                    onDatesSet={onDatesSet}
                    calendarType={calendarType}
                    switchCalendarType={switchCalendarType}
                    selectedEventDetails={selectedEventDetails}
                    selectedDate={selectedDate}
                    catFilters={catFilters}
                    setCatFilters={handleCatFilter}
                    widgetHash={widgetHash}
                    widgetHeight={widgetHeight}
                    allowedCategories={allowedCategories}
                    isLoadingEvents={isLoadingEvents}
                />
            );
        }

        return (
            <CalendarMonth
                events={eventsList}
                fetchEvents={fetchEvents}
                onClickEvent={onClickEvent}
                onDatesSet={onDatesSet}
                calendarType={calendarType}
                switchCalendarType={switchCalendarType}
                selectedEventDetails={selectedEventDetails}
                setCatFilters={handleCatFilter}
                catFilters={catFilters}
                selectedDate={selectedDate}
                widgetHash={widgetHash}
                toggleAllFilters={toggleAllFilters}
                showAllFilters={showAllFilters}
                allowedCategories={allowedCategories}
            />
        );
    };

    return <div id={`cal-${widgetHash}`}>{renderCalendar()}</div>;
};

export default CalendarModule;
