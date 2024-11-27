import { FC, useRef } from "react";
import {
    CalendarList as CalList,
    EventClickArg,
    ScrollBar,
    Switch,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { getEventCategoryByColor } from "src/api/utils/calendarUtils";
import CONFIG from "src/config";
import { calendarMessages } from "src/globalMessages";
import { eventClickHandler, handleHeaderTooltips } from "./calendarHelpers";
import { ECalendarType, ICalendarBaseProps } from "./types";
import "./calendar.scss";

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.CALENDAR;
const { Z_INDEX_REGISTRY } = CONFIG.UI;

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
    isFetchingEvents,
}) => {
    const { i18n } = useTranslation();
    const scrollRef = useRef<HTMLElement>();

    return (
        <div
            className={`border-none block min-h-[50px] relative ${
                showFullSize ? "calendar-list-full-size-wrap" : ""
            }`}
            style={
                !showFullSize ? { height: widgetHeight ?? WIDGET_HEIGHT } : {}
            }
        >
            {!showFullSize && (
                <div
                    className="flex absolute top-2 left-[10px] two-col:left-3"
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
                style={
                    showFullSize
                        ? {}
                        : { height: widgetHeight ?? WIDGET_HEIGHT }
                }
            >
                <CalList
                    locale={i18n.language}
                    eventClickHandler={(e: EventClickArg) =>
                        eventClickHandler(e, events, onClickEvent)
                    }
                    handleHeaderTooltips={handleHeaderTooltips}
                    noEventsMsg={calendarMessages.noEvents}
                    isFetchingEvents={!!isFetchingEvents}
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
