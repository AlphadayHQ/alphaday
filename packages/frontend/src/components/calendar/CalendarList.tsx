import { FC, useRef } from "react";
import {
    CalendarList as CalList,
    EventClickArg,
    ScrollBar,
    Switch,
} from "@alphaday/ui-kit";
import { getEventCategoryByColor } from "src/api/utils/calendarUtils";
import CONFIG from "src/config";
import { calendarMessages } from "src/globalMessages";
import {
    eventClickHandler,
    getEventMeta,
    handleHeaderTooltips,
    getValidCalendarDateRange,
} from "./calendarHelpers";
import { ECalendarType, ICalendarBaseProps } from "./types";

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.CALENDAR;
const { Z_INDEX_REGISTRY } = CONFIG.UI;
const FULLSIZE_CAL_HEIGHT = 660;

const CalendarList: FC<ICalendarBaseProps> = ({
    events,
    onClickEvent,
    calendarType,
    switchCalendarType,
    selectedEventDetails,
    onDatesSet,
    showFullSize,
    selectedDate,
    catFilters,
    widgetHash,
    widgetHeight,
    isLoadingEvents,
}) => {
    const scrollRef = useRef<HTMLElement>();

    const noEvents = events === undefined || events?.length === 0;
    const noEventsMsg = isLoadingEvents ? "" : calendarMessages.noEvents;

    return (
        <span
            className="border-none block min-h-[50px] relative"
            style={{
                height: showFullSize
                    ? FULLSIZE_CAL_HEIGHT
                    : widgetHeight ?? WIDGET_HEIGHT,
            }}
        >
            <ScrollBar
                containerRef={(el) => {
                    scrollRef.current = el;
                }}
            >
                <div className={noEvents ? "mb-0" : "mb-5"}>
                    {!showFullSize && (
                        <div
                            className="flex fixed top-14 left-[10px] single-col:left-4 two-col:left-5"
                            style={{
                                zIndex: Z_INDEX_REGISTRY.CALENDAR_LIST_SWITCH,
                            }}
                        >
                            <Switch
                                options={["Calendar", "List"]}
                                onChange={switchCalendarType}
                                checked={calendarType === ECalendarType.List}
                            />
                        </div>
                    )}
                    <CalList
                        eventClickHandler={(e: EventClickArg) =>
                            eventClickHandler(e, onClickEvent)
                        }
                        getEventMeta={getEventMeta}
                        handleHeaderTooltips={handleHeaderTooltips}
                        getValidCalendarDateRange={getValidCalendarDateRange}
                        noEventsMsg={noEventsMsg}
                        getEventCategoryByColor={getEventCategoryByColor}
                        events={events}
                        onDatesSet={onDatesSet}
                        selectedEventDetails={selectedEventDetails}
                        catFilters={catFilters}
                        showFullSize={showFullSize}
                        selectedDate={selectedDate}
                        widgetHash={widgetHash}
                    />
                </div>
            </ScrollBar>
        </span>
    );
};

export default CalendarList;
