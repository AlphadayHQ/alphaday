/* eslint-disable react/button-has-type */
import { FC, RefObject } from "react";
import moment from "moment";
import { createPortal } from "react-dom";
import ScrollBar from "react-perfect-scrollbar";
import { TDatePos, TEvent, TEventCategory } from "../calendar/event";

export interface ITooltipProps {
    disabled?: boolean;
    label?: string;
    onClick?: () => void | (() => Promise<void>);
    width: string;
    events: TEvent[];
    date: string;
    handleEventClick: (event: TEvent) => void;
    tooltipRef?: RefObject<HTMLDivElement>;
    position: TDatePos;
    catFilters: TEventCategory[];
    isFullsize: boolean;
    getEventCategoryByType: (
        itemType: string | undefined,
        options: TEventCategory[]
    ) => TEventCategory;
}
export interface TooltipContentProps {
    content: string;
}

export const CalendarTooltip: FC<ITooltipProps> = ({
    date,
    events,
    width,
    handleEventClick,
    tooltipRef,
    position,
    catFilters,
    isFullsize,
    getEventCategoryByType,
}) => {
    const curDate = moment(date);
    const handleDate = (start: string, end: string): string => {
        if (start) {
            const Start = moment(start);

            if (end) {
                const End = moment(end);

                if (start === end) return "undefined"; // TODO: handle a return value here

                if (
                    curDate.isSame(Start, "month") &&
                    curDate.isSame(Start, "day") &&
                    curDate.isSame(End, "month") &&
                    curDate.isSame(End, "day")
                ) {
                    return `${String(Start.format("hA"))} - ${String(
                        End.format("hA")
                    )}`;
                }

                // Handle All Day events
                if (curDate.isAfter(Start) && curDate.isBefore(End)) {
                    return "ALL-DAY";
                }

                // Handle Edge Cases
                if (curDate.isBefore(Start) && curDate.isBefore(End)) {
                    return `${String(Start.format("hA"))} - *`;
                }
            }
        }
        return "undefined";
    };

    /**
     * A portal is used here to escape the DOM hierachy
     * because we want it this tooltip to overlay all widgets
     * but still maintain its scroll position.
     *
     * This would have been possible with the tooltip absolutely
     * positioned but the widget's flip animation hides some part of
     * the widget that overflows. This will cut out the tooltip.
     */

    return createPortal(
        <div
            className="absolute"
            style={{
                top: position.top,
                ...("left" in position && { left: position.left }),
                ...("right" in position && { right: position.right }),
            }}
        >
            <div
                ref={tooltipRef}
                style={{
                    width,
                    zIndex: isFullsize ? 1050 : 50,
                }}
            >
                <div className="tooltip">
                    <div className="tooltip-wrapper calendar-wrap">
                        <div className="events">
                            <div className="date">
                                <span className="date-text">
                                    {curDate.format("ddd")}
                                </span>
                                <span className="date-number">
                                    {curDate.format("DD")}
                                </span>
                            </div>
                            <div className="list">
                                <ScrollBar>
                                    {events.map((event, i) => {
                                        const category = getEventCategoryByType(
                                            event.type,
                                            catFilters
                                        );

                                        return (
                                            <span
                                                key={event.id}
                                                className="pointer"
                                                onClick={() =>
                                                    handleEventClick(event)
                                                }
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <p className="eventItem">
                                                    <span
                                                        className="dot"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    />
                                                    <span className="event-category">
                                                        {category.label}
                                                    </span>
                                                    <span className="separator">
                                                        •
                                                    </span>
                                                    <span className="dates">
                                                        {handleDate(
                                                            event.start,
                                                            event.end
                                                        )}
                                                    </span>
                                                    <span className="separator">
                                                        •
                                                    </span>
                                                    <span>
                                                        {event.location}
                                                    </span>
                                                </p>
                                                <p className="event-title">
                                                    {event.title}
                                                </p>
                                                <hr
                                                    className="hr"
                                                    style={{
                                                        display:
                                                            i + 1 ===
                                                            events.length
                                                                ? "none"
                                                                : "block",
                                                    }}
                                                />
                                            </span>
                                        );
                                    })}
                                </ScrollBar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
