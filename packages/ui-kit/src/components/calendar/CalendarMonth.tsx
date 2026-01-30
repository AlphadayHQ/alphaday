import { FC, useRef, useEffect, useCallback } from "react";
import { ViewContentArg, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import moment from "moment-with-locales-es6";
import {
    ICalendarBaseProps,
    TElemCoords,
    TEvent,
    TEventCategory,
} from "./event";

const CAL_CONTAINER_ID = "cal-month-container";

/**
 * get the coordinates of an element relative to the document
 * @param elem
 * @returns TElemCoords
 */

export type TDatePos = {
    top: number;
} & (
    | {
          left: number;
      }
    | {
          right: number;
      }
);
export const getCoords = (elem: HTMLElement | null): TElemCoords => {
    // crossbrowser version
    if (elem === null) return { top: 0, left: 0, right: 0 };
    const box = elem.getBoundingClientRect();

    const { body } = document;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft =
        window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    const right = window.innerWidth - box.width - left;

    return {
        top: Math.round(top),
        left: Math.round(left),
        right: Math.round(right),
    };
};

const MAX_DOTS_PER_DAY = 30;
const DOT_CLASS =
    "fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-today";

/**
 * Build all event dots in a single batch pass instead of per-event callbacks.
 * Uses a pre-built day cell map to avoid repeated DOM queries,
 * native Date arithmetic instead of moment, and DocumentFragment
 * for a single DOM write per day cell.
 */
const renderEventDots = (events: TEvent[], widgetHash: string): void => {
    const cal = document.querySelector(`#cal-${widgetHash}`);
    if (!cal) return;

    // Clear any previously rendered dots and "+X more" links before re-rendering
    cal.querySelectorAll(
        `.${DOT_CLASS.split(" ")[0]}, .fc-daygrid-more-link`
    ).forEach((el) => el.remove());

    // Build day cell lookup map once (max 42 cells in a month grid)
    const dayCellMap = new Map<string, Element>();
    cal.querySelectorAll(".fc-daygrid-day").forEach((cell) => {
        const date = cell.getAttribute("data-date");
        const container = cell.querySelector(
            ".fc-daygrid-day-frame .fc-daygrid-day-events"
        );
        if (date && container) dayCellMap.set(date, container);
    });

    // Group dots by day
    const dotsByDay = new Map<
        string,
        { id: string; color: string | undefined }[]
    >();

    events
        .filter((event) => event.start)
        .forEach((event) => {
            const startTime = new Date(event.start);
            const endTime =
                new Date(event.end || event.start).getTime() + 86_400_000;
            const current = new Date(startTime);

            while (current.getTime() < endTime) {
                const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
                if (dayCellMap.has(dateStr)) {
                    let dayDots = dotsByDay.get(dateStr);
                    if (!dayDots) {
                        dayDots = [];
                        dotsByDay.set(dateStr, dayDots);
                    }
                    dayDots.push({
                        id: event.id,
                        color: event.backgroundColor,
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        });

    // Render dots using DocumentFragment (single DOM write per day)
    Array.from(dotsByDay.entries()).forEach(([dateStr, dots]) => {
        const container = dayCellMap.get(dateStr);
        if (!container) return;

        const fragment = document.createDocumentFragment();
        const seen = new Set<string>();
        let overflow = 0;

        dots.forEach((dot) => {
            if (seen.has(dot.id)) return;
            seen.add(dot.id);
            if (seen.size <= MAX_DOTS_PER_DAY) {
                const span = document.createElement("span");
                if (dot.color) span.style.backgroundColor = dot.color;
                span.className = DOT_CLASS;
                fragment.appendChild(span);
            } else {
                overflow += 1;
            }
        });

        if (overflow > 0) {
            const moreEl = document.createElement("span");
            moreEl.className = "fc-daygrid-more-link fc-more-link text-[11px]";
            moreEl.textContent = `+${overflow} more`;
            fragment.appendChild(moreEl);
        }

        container.appendChild(fragment);
    });
};

interface ICalendarMonth extends ICalendarBaseProps {
    locale: string;
    handleHeaderTooltips: (
        info: DatesSetArg,
        widgetHash: string,
        showFullSize: boolean | undefined
    ) => void;
    catFilters: TEventCategory[];
    clickDateEvents: {
        date: Date | undefined;
        events: TEvent[];
        position: TDatePos;
    };
    setClickDateEvents: React.Dispatch<
        React.SetStateAction<{
            date: Date | undefined;
            events: TEvent[];
            position: TDatePos;
        }>
    >;
    isAlphaModalOpen: boolean;
    handleIsAlphaModalOpen: (val: boolean) => void;
}

export const CalendarMonth: FC<ICalendarMonth> = ({
    locale,
    events,
    onDatesSet,
    showFullSize,
    catFilters: _catFilters,
    selectedDate,
    widgetHash,
    handleHeaderTooltips,
    clickDateEvents,
    setClickDateEvents,
    isAlphaModalOpen,
    handleIsAlphaModalOpen,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const eventsRef = useRef(events);
    eventsRef.current = events;

    const handleSize = (event: ViewContentArg): void => {
        const contentAPi = event.view.calendar;
        const { type } = event.view;
        if (type === "listWeek") {
            if (window.matchMedia("(min-width: 992px)").matches) {
                contentAPi.changeView("dayGridMonth");
            } else {
                contentAPi.changeView("listWeek");
            }
        }
    };

    const handleDatesClick = useCallback(
        (info: DateClickArg) => {
            const cal = document.querySelector(`#cal-${widgetHash}`);

            const { date, jsEvent } = info;
            if (events && cal) {
                // Filter events for that day
                const dateEvents = events.filter((e) =>
                    moment(date).isBetween(
                        moment(e.start).subtract(1, "day"),
                        e.end || e.start,
                        "milliseconds",
                        "()" // exclusive check
                    )
                );

                const parentElem: HTMLElement | null = cal.querySelector(
                    `#${CAL_CONTAINER_ID}`
                );

                // Get Calendar Coordinates relative to document
                const parentCoords = getCoords(parentElem);

                // Get Calendar Position relative to view port
                const parentPos = parentElem?.getBoundingClientRect() || {
                    left: 0,
                    width: 0,
                    top: 0,
                };

                // Get Position of day square
                // jsEvent.target can be any child element but we want a particular div so that position is uniform
                // JsEvent can be undefined
                const childPos = (jsEvent?.target as HTMLElement)
                    ?.closest(
                        "div.fc-daygrid-day-frame.fc-scrollgrid-sync-inner"
                    )
                    ?.getBoundingClientRect();

                if (childPos === undefined) return;

                // Days not of the current month should not open the tooltip
                const otherday = (jsEvent?.target as HTMLElement)?.closest(
                    "td.fc-day-other"
                );

                const relativePos =
                    (childPos.left - parentPos.left) / parentPos.width || 0;

                if (dateEvents.length > 0 && otherday == null) {
                    const positionGen = () => {
                        const pos = {
                            top: childPos.top - parentPos.top,
                            left: 0,
                            right: 0,
                        };
                        if (parentPos.width > 427) {
                            if (relativePos < 0.5) {
                                pos.left = childPos.left - parentPos.left;
                                // for the leftmost cell
                                if (childPos.left - parentPos.left < 10) {
                                    pos.left = 65;
                                }
                            } else {
                                pos.right =
                                    parentPos.width -
                                    childPos.left +
                                    parentPos.left +
                                    170;
                            }
                        } else if (parentPos.width > 375) {
                            pos.left = relativePos * 80 + 80;
                        } else if (relativePos < 0.5) {
                            pos.left = relativePos * 10 + 60;
                        } else {
                            pos.right = 260 - relativePos * 30;
                        }

                        if (pos.left === 0) {
                            return {
                                top: parentCoords.top + pos.top,
                                right: parentCoords.right + pos.right,
                            };
                        }

                        return {
                            top: parentCoords.top + pos.top,
                            left: parentCoords.left + pos.left,
                        };
                    };
                    if (isAlphaModalOpen) {
                        // Allow double click to close tooltip
                        if (moment(clickDateEvents.date).isSame(date)) {
                            handleIsAlphaModalOpen(false);
                        } else {
                            setClickDateEvents({
                                date,
                                events: dateEvents,
                                position: positionGen(),
                            });
                            // show modal
                            handleIsAlphaModalOpen(true);
                        }
                    } else {
                        setClickDateEvents({
                            date,
                            events: dateEvents,
                            position: positionGen(),
                        });
                        // show modal
                        handleIsAlphaModalOpen(true);
                    }
                } else {
                    // close modal
                    handleIsAlphaModalOpen(false);
                }
            }
        },
        [
            widgetHash,
            events,
            isAlphaModalOpen,
            clickDateEvents.date,
            handleIsAlphaModalOpen,
            setClickDateEvents,
        ]
    );

    const handleNewMonthView = useCallback(
        (info: DatesSetArg) => {
            handleHeaderTooltips(info, widgetHash, showFullSize);
            // Re-render dots after FC has swapped grid cells for the new month
            if (eventsRef.current?.length) {
                renderEventDots(eventsRef.current, widgetHash);
            }
            if (onDatesSet != null) {
                onDatesSet(info.view.currentStart.toString());
            }
        },
        [handleHeaderTooltips, widgetHash, showFullSize, onDatesSet]
    );

    const handleViewMount = useCallback(
        (info: ViewContentArg) => {
            const cal = document.querySelector(`#cal-${widgetHash}`);

            if (cal) {
                const { view } = info;
                const { currentDate }: { currentDate: string } =
                    // @ts-expect-error FIXME: getCurrentData is private
                    view.getCurrentData();
                const monthHeaderButton = cal.getElementsByClassName(
                    "fc-dayGridMonth-button"
                )[0];
                const weekHeaderButton = cal.getElementsByClassName(
                    "fc-timeGridWeek-button"
                )[0];
                monthHeaderButton?.setAttribute("data-tip", "Month view");
                monthHeaderButton?.setAttribute("data-place", "left");
                weekHeaderButton?.setAttribute("data-tip", "Week view");
                weekHeaderButton?.setAttribute("data-place", "right");

                if (view.type === "dayGridMonth") {
                    const [p1, p2] =
                        cal.getElementsByClassName("fc-prev-button");
                    const [n1, n2] =
                        cal.getElementsByClassName("fc-next-button");

                    p1?.setAttribute(
                        "data-tip",
                        moment(currentDate)
                            .subtract(1, "M")
                            .format("MMMM, YYYY")
                    );
                    p2?.setAttribute(
                        "data-tip",
                        moment(currentDate)
                            .subtract(1, "M")
                            .format("MMMM, YYYY")
                    );
                    n1?.setAttribute(
                        "data-tip",
                        moment(currentDate).add(1, "M").format("MMMM, YYYY")
                    );
                    n2?.setAttribute(
                        "data-tip",
                        moment(currentDate).add(1, "M").format("MMMM, YYYY")
                    );
                    n2?.setAttribute("data-place", "right");
                }

                if (view.type === "timeGridWeek" && cal) {
                    const [, p2] = cal.getElementsByClassName("fc-prev-button");
                    const [, n2] = cal.getElementsByClassName("fc-next-button");

                    p2?.setAttribute("data-tip", "Previous Week");
                    n2?.setAttribute("data-tip", "Next Week");
                    n2?.setAttribute("data-place", "right");
                }

                // Render dots on initial mount when events are already available
                if (eventsRef.current?.length) {
                    renderEventDots(eventsRef.current, widgetHash);
                }
            }
        },
        [widgetHash]
    );

    // Re-render dots when event data changes (e.g., new data from queries).
    // viewDidMount and datesSet handle lifecycle-driven rendering;
    // this effect handles data-driven updates when the grid is already stable.
    useEffect(() => {
        if (!events?.length) return undefined;
        const rafId = requestAnimationFrame(() => {
            renderEventDots(events, widgetHash);
        });
        return () => cancelAnimationFrame(rafId);
    }, [events, widgetHash]);

    return (
        <FullCalendar
            initialDate={selectedDate}
            locale={locale}
            plugins={[dayGridPlugin, interactionPlugin]}
            dayMaxEvents={MAX_DOTS_PER_DAY}
            headerToolbar={{
                left: "",
                center: "prev, title,next",
                right: "today",
            }}
            datesSet={handleNewMonthView}
            initialView="dayGridMonth"
            selectLongPressDelay={100}
            nowIndicator
            viewDidMount={handleViewMount}
            views={{
                timeGridDatop: {
                    dayHeaders: false,
                },
            }}
            navLinkDayClick={() => {}} // this controls the date number click
            eventDisplay="none"
            events={events}
            ref={calendarRef}
            windowResize={handleSize}
            contentHeight="auto"
            firstDay={1}
            dateClick={handleDatesClick}
        />
    );
};
