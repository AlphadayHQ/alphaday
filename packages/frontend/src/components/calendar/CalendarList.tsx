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
import { eventClickHandler, handleHeaderTooltips } from "./calendarHelpers";
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
    const noEventsMsg = isLoadingEvents ? "" : calendarMessages.noEvents;

    return (
        <div
            className="border-none min-h-[50px] relative"
            style={{
                height: showFullSize
                    ? FULLSIZE_CAL_HEIGHT
                    : widgetHeight ?? WIDGET_HEIGHT,
            }}
        >
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
            <ScrollBar
                containerRef={(el) => {
                    scrollRef.current = el;
                }}
                style={{
                    height: showFullSize
                        ? FULLSIZE_CAL_HEIGHT
                        : widgetHeight ?? WIDGET_HEIGHT,
                }}
            >
                <CalList
                    eventClickHandler={(e: EventClickArg) =>
                        eventClickHandler(e, events, onClickEvent)
                    }
                    handleHeaderTooltips={handleHeaderTooltips}
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
            </ScrollBar>
        </div>
    );
};

export default CalendarList;
