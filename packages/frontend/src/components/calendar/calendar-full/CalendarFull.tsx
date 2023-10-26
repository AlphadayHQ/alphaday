import { FC, useRef } from "react";
import EventDetails from "src/components/calendar/calendar-full/event-details/EventDetails";
import { Z_INDEX_REGISTRY } from "src/config/zIndexRegistry";
import CalendarList from "../calendar-list/CalendarList";
import CalendarMonth from "../calendar-month/CalendarMonth";
import { ICalendarBaseProps } from "../types";

const { CALENDAR_LIST, CALENDAR_EVENT_DETAILS } = Z_INDEX_REGISTRY;

const CalendarFull: FC<ICalendarBaseProps> = ({
    events,
    fetchEvents,
    onClickEvent,
    onDatesSet,
    calendarType,
    switchCalendarType,
    setCatFilters,
    catFilters,
    selectedEventDetails,
    isLoadingEventDetails,
    selectedDate,
    toggleAllFilters,
    showAllFilters,
    widgetHash,
    allowedCategories,
    isLoadingEvents,
}) => {
    const fullCalendarWrapRef = useRef<HTMLDivElement>(null);
    return (
        <div
            className="w-full flex bg-backgroundVariant800"
            ref={fullCalendarWrapRef}
        >
            <div className="column flex-[35.3%] relative">
                <CalendarMonth
                    events={events}
                    fetchEvents={fetchEvents}
                    onClickEvent={onClickEvent}
                    onDatesSet={onDatesSet}
                    calendarType={calendarType}
                    switchCalendarType={switchCalendarType}
                    selectedEventDetails={selectedEventDetails}
                    setCatFilters={setCatFilters}
                    catFilters={catFilters}
                    selectedDate={selectedDate}
                    showFullSize
                    toggleAllFilters={toggleAllFilters}
                    showAllFilters={showAllFilters}
                    widgetHash={widgetHash}
                    allowedCategories={allowedCategories}
                    fullCalendarWrapRef={fullCalendarWrapRef}
                />
            </div>
            <div
                className="column flex-[23.1%]"
                style={{
                    zIndex: CALENDAR_LIST,
                    boxShadow: "-2px 0px 34px rgba(0, 0, 0, 0.2)",
                }}
            >
                <CalendarList
                    /**
                     * Trick to force a re-render when switching months
                     */
                    key={events ? events[0]?.id : ""}
                    events={events}
                    fetchEvents={fetchEvents}
                    onClickEvent={onClickEvent}
                    onDatesSet={onDatesSet}
                    calendarType={calendarType}
                    switchCalendarType={switchCalendarType}
                    selectedEventDetails={selectedEventDetails}
                    selectedDate={selectedDate}
                    showFullSize
                    catFilters={catFilters}
                    setCatFilters={setCatFilters}
                    widgetHash={widgetHash}
                    allowedCategories={allowedCategories}
                    isLoadingEvents={isLoadingEvents}
                />
            </div>
            <div
                className="column flex-[41.6%]"
                style={{
                    zIndex: CALENDAR_EVENT_DETAILS,
                }}
            >
                <EventDetails
                    isLoadingEventDetails={!!isLoadingEventDetails}
                    event={selectedEventDetails}
                    eventFilters={catFilters}
                />
            </div>
        </div>
    );
};

export default CalendarFull;
