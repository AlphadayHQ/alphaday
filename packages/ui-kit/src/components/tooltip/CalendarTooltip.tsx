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
            className="absolute w-0"
            style={{
                top: position.top,
                ...("left" in position && { left: position.left }),
                ...("right" in position && { right: position.right }),
            }}
        >
            <div>
                <div
                    className="relative inline-block"
                    ref={tooltipRef}
                    style={{
                        width,
                        zIndex: isFullsize ? 1050 : 50,
                    }}
                >
                    <div
                        className="flex w-full text-primary items-center text-left pt-4 pr-0 pb-4 pl-3 absolute -ml-[60px] cursor-auto top-[120%] left -[50%] z-[1] justify-start bg-backgroundVariant1100 border border-btnRingVariant500 shadow-backgroundVariant1700 shadow-[0px_0px_35px_9px] rounded-[5px]"
                        style={{
                            width,
                        }}
                    >
                        <div className="flex flex-1 w-full">
                            <div className="w-10 mr-4 flex flex-col">
                                <span className=" fontGroup-support m-0.5 mt-0 text-center text-primaryVariant100">
                                    {curDate.format("ddd")}
                                </span>
                                <span className="fontGroup-major text-center -tracking-[0.5px]">
                                    {curDate.format("DD")}
                                </span>
                            </div>
                            <div className="mt-[1.5px] mix-blend-lighten max-h-[300px] [&>div]:pr-[10px]">
                                <ScrollBar>
                                    {events.map((event, i) => {
                                        const category = getEventCategoryByType(
                                            event.type,
                                            catFilters
                                        );

                                        return (
                                            <span
                                                key={event.id}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleEventClick(event)
                                                }
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <p className="flex fontGroup-support flex-wrap mb-1 text-primaryVariant100">
                                                    <span
                                                        className="w-2 h-2 self-center block rounded-full m-0 mr-[5px] flex-none order-none grow-0"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    />
                                                    <span className="text-secondaryOrange self-center">
                                                        {category.label}
                                                    </span>
                                                    <span className="static w-[5px] h-[14px] text-primaryVariant100 m-0 mx-[7px] self-center">
                                                        •
                                                    </span>
                                                    <span className="whitespace-nowrap self-center">
                                                        {handleDate(
                                                            event.start,
                                                            event.end
                                                        )}
                                                    </span>
                                                    <span className="static w-[5px] h-[14px] text-primaryVariant100 m-0 mx-[7px] self-center">
                                                        •
                                                    </span>
                                                    <span>
                                                        {event.location}
                                                    </span>
                                                </p>
                                                <p className="fontGroup-highlightSemi text-primary flex-none m-[1px] max-w-[200px] break-word">
                                                    {event.title}
                                                </p>
                                                <hr
                                                    className="mt-[10px] bg-btnRingVariant500 border-primaryVariant200"
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
