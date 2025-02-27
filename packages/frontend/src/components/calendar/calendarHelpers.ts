import { DatesSetArg, EventClickArg } from "@alphaday/ui-kit";
import moment from "moment-with-locales-es6";
import ReactGA from "react-ga4";
import { TEvent } from "src/api/types";
import { slugify } from "src/api/utils/textUtils";
import { calendarMessages } from "src/globalMessages";

type TOnclickEvent = (
    eId: string,
    eUrlTitle: string,
    eventStart: string
) => void;

export const eventClickHandler = (
    e: EventClickArg,
    events: TEvent[] | undefined,
    onClickEvent?: TOnclickEvent
): void => {
    const selectedEvent = events?.find((evt) => evt.id === e.event.id);
    if (selectedEvent === undefined) return;
    ReactGA.event({
        category: "Event",
        action: `Clicked on event - ${selectedEvent.title}`,
    });

    const clickedDate = (e.el?.previousSibling as HTMLElement)?.getAttribute(
        "data-date"
    );

    if (onClickEvent !== undefined) {
        onClickEvent(
            selectedEvent.id,
            slugify(selectedEvent.title),
            String(clickedDate || e.event.start)
        );
    }
};

export const eventTooltipClickHandler = (
    e: TEvent,
    date: Date | undefined,
    onClickEvent?: TOnclickEvent
): void => {
    ReactGA.event({
        category: "Event",
        action: `Clicked on event - ${String(e.title)}`,
    });

    if (onClickEvent !== undefined) {
        onClickEvent(e.id, slugify(e.title), date?.toString() || e.start);
    }
};

export const handleHeaderTooltips = (
    info: DatesSetArg,
    widgetHash: string,
    showFullSize: boolean | undefined
): void => {
    const { view } = info;
    const cal = document.querySelector(`#cal-${widgetHash}`);

    if (
        !showFullSize &&
        view.type === "listMonth" &&
        moment(view.currentStart).isBefore(moment(new Date()))
    ) {
        cal
            ?.getElementsByClassName("fc-prev-button")[0]
            .setAttribute("title", calendarMessages.noEvents);
    } else {
        cal
            ?.getElementsByClassName("fc-prev-button")[0]
            .setAttribute("title", "Previous month");
    }
    cal
        ?.getElementsByClassName("fc-next-button")[0]
        .setAttribute("title", "Next month");
    cal
        ?.getElementsByClassName("fc-today-button")[0]
        .setAttribute("title", "Go to Today");
};
