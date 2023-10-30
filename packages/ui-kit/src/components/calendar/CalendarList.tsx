import { FC, useCallback, useEffect, useRef, useState } from "react";
import { EventMountArg, DatesSetArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { TEvent, TEventDetails } from "./event";

export type EventMeta = {
    id: string;
    title: string;
    location: string;
};

export type TEventCategory = {
    value: string;
    label: string;
    category: string;
    color: string;
};

const NoEvents: FC<{ msg: string }> = ({ msg }) => {
    return (
        <div className="w-full h-full flex items-center justify-center text-primary fontGroup-highlight">
            {msg}
        </div>
    );
};

export interface ICalendarBaseProps {
    events: TEvent[] | undefined;
    onDatesSet?: (d: string) => void;
    selectedEventDetails?: TEventDetails;
    catFilters: TEventCategory[];
    showFullSize?: boolean;
    selectedDate?: Date;
    widgetHash: string;
}

interface ICalendarList extends ICalendarBaseProps {
    eventClickHandler: (e: EventClickArg) => void;
    getEventMeta: (e: EventMountArg | EventClickArg) => EventMeta | undefined;
    handleHeaderTooltips: (
        info: DatesSetArg,
        widgetHash: string,
        showFullSize: boolean | undefined
    ) => void;
    getValidCalendarDateRange: () => {
        start: Date;
        end: Date;
    };
    noEventsMsg: string;
    getEventCategoryByColor: (
        color: string | undefined,
        options: TEventCategory[]
    ) => TEventCategory;
}

export const CalendarList: FC<ICalendarList> = ({
    events,
    selectedEventDetails,
    onDatesSet,
    showFullSize,
    selectedDate,
    catFilters,
    widgetHash,
    eventClickHandler,
    getEventMeta,
    handleHeaderTooltips,
    getValidCalendarDateRange,
    noEventsMsg,
    getEventCategoryByColor,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const scrollRef = useRef<HTMLElement>();
    const eventDetailsRef = useRef<TEventDetails>();
    // tracks if the SelectedEvent was updated from the CalendarList
    const [listEventClick, setlistEventClick] = useState(false);

    const handleDateset = useCallback(
        (info: DatesSetArg) => {
            handleHeaderTooltips(info, widgetHash, showFullSize);
            if (onDatesSet != null && !showFullSize) {
                onDatesSet(info.view.currentStart.toString());
            }
        },
        [handleHeaderTooltips, onDatesSet, showFullSize, widgetHash]
    );

    const eventRender = useCallback(
        (e: EventMountArg, categoryFilters: TEventCategory[]): void => {
            const { el, view, backgroundColor } = e;
            const category = getEventCategoryByColor(
                backgroundColor,
                categoryFilters
            );
            const selectedEvent = getEventMeta(e);

            if (selectedEvent === undefined) return;

            if (view.type === "listMonth" || view.type === "listWeek") {
                const dates = document.querySelectorAll(".fc-list-day-text");
                const title = el.querySelector<HTMLElement>(
                    ".fc-list-event-time"
                );
                const time = title?.innerHTML;

                (title?.parentNode as HTMLElement)?.classList?.add(
                    `list-event-${e.event.id}`
                );

                if (title != null) {
                    title.innerHTML = `
            <div style="width: 100%; display:flex; align-items: center; font-size: 12px; flex-wrap: wrap;">
            <div style="width:7px; height:7px; border-radius:4px; margin-right: 5px; display: inline-block; background-color: ${backgroundColor}"></div>
            <span style="color:${String(
                backgroundColor
            )}; float: right; font-weight: 600;">${String(category?.label)}
            </span>
            <span style="margin: 0 5px;">•</span>
            <span style="text-transform: uppercase">${time || ""}</span>
            <span style="margin: 0 5px;">•</span>
            <span style="white-space: pre-wrap;">${String(
                selectedEvent.location
            )}</span>
            </div>
            `;
                }

                dates.forEach((date) => {
                    const item = date;
                    const text = date.textContent?.split(" ");
                    if (!text) return;
                    const now = moment().format("DD");
                    if (text.length > 1) {
                        item.innerHTML = `${text[1]}<span>${text[0]}</span>`;
                        if (now === text[0]) {
                            item.classList.add("now");
                        }
                    }
                });
            }
        },
        [getEventMeta, getEventCategoryByColor]
    );

    const handleEventDidMount = (e: EventMountArg) => {
        eventRender(e, catFilters);
    };
    useEffect(() => {
        /**
         * The CalendarList should only scroll to the selected date when:
         * (1) the event Details is retrieved
         * (2) the event wast not selected from CalendarList
         * (3) the Calendar is in full size view
         */

        if (eventDetailsRef.current?.id !== selectedEventDetails?.id) {
            eventDetailsRef.current = selectedEventDetails;

            if (listEventClick) setlistEventClick(false);

            if (listEventClick === false && showFullSize) {
                const t: string = moment(selectedDate).format("YYYY-MM-DD");
                setTimeout(() => {
                    const ev: HTMLElement | null = document.querySelector(
                        `.fc-list-day.fc-day[data-date='${t}']`
                    );

                    if (scrollRef.current && ev?.offsetTop) {
                        scrollRef.current.scrollBy({
                            top: ev.offsetTop - scrollRef.current.scrollTop,
                            left: 0,
                            // behavior: "smooth", this doesn't work on chrome or firefox anymore
                        });
                    }
                }, 500);
            }
        }
    }, [listEventClick, selectedDate, selectedEventDetails, showFullSize]);

    // remove class event-highlight from elements that are not of the selectedEvent
    [
        ...document.getElementsByClassName("fc-list-event event-highlight"),
    ].forEach((el) => {
        if (
            !(el as HTMLElement).classList.contains(
                `list-event-${selectedEventDetails?.id}`
            )
        ) {
            (el as HTMLElement).classList.remove("event-highlight");
            const sibling = el.previousSibling as HTMLElement;
            if (sibling?.classList.contains("fc-list-day")) {
                sibling.classList.remove("event-highlight");
            }
        }
    });

    // add class event-highlight from elements that are of the selectedEvent
    [
        ...document.getElementsByClassName(
            `list-event-${selectedEventDetails?.id}`
        ),
    ].forEach((el) => {
        (el as HTMLElement).classList.add("event-highlight");
        const sibling = el.previousSibling as HTMLElement;
        if (sibling?.classList.contains("fc-list-day")) {
            sibling.classList.add("event-highlight");
        }
    });

    document
        .getElementsByClassName(
            "fc-timeGridWeek-button fc-button fc-button-primary"
        )[0]
        ?.addEventListener("click", () => {
            calendarRef?.current?.getApi().changeView("listWeek");
        });
    document
        .getElementsByClassName(
            "fc-dayGridMonth-button fc-button fc-button-primary"
        )[0]
        ?.addEventListener("click", () => {
            calendarRef?.current?.getApi().changeView("listMonth");
        });

    document
        .getElementsByClassName(
            "fc-today-button fc-button fc-button-primary"
        )[0]
        ?.addEventListener("click", () => {
            calendarRef?.current?.getApi().gotoDate(new Date());
        });

    document.querySelectorAll(".fc-list-event").forEach((node) => {
        const sibling = node.previousSibling as unknown as HTMLDivElement;
        node.addEventListener("mouseenter", () => {
            node.classList.add("event-hover-highlight");
            if (sibling?.classList.contains("fc-list-day")) {
                sibling.classList.add("event-hover-highlight");
            }
        });
        node.addEventListener("mouseleave", () => {
            node.classList.remove("event-hover-highlight");
            sibling?.classList.remove("event-hover-highlight");
        });
    });

    return (
        <div className="calendar-list">
            <FullCalendar
                initialDate={selectedDate}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                ]}
                headerToolbar={{
                    left: "",
                    center: "prev, title,next",
                    right: "today",
                }}
                initialView="listMonth"
                navLinks
                selectable
                selectLongPressDelay={100}
                nowIndicator
                views={{
                    listMonth: {
                        listDaySideFormat: false,
                        listDayFormat: {
                            day: "2-digit",
                            weekday: "short",
                        },
                    },
                    listWeek: {
                        listDaySideFormat: false,
                        listDayFormat: {
                            day: "2-digit",
                            weekday: "short",
                        },
                    },
                }}
                eventDisplay="block"
                dateClick={() => {}}
                navLinkDayClick={() => {}}
                events={events}
                eventDidMount={handleEventDidMount}
                ref={calendarRef}
                firstDay={1}
                eventClick={(e) => {
                    setlistEventClick(true);
                    eventClickHandler(e);
                }}
                validRange={getValidCalendarDateRange}
                datesSet={handleDateset}
                noEventsContent={<NoEvents msg={noEventsMsg} />}
            />
        </div>
    );
};
