import { DatesSetArg, EventClickArg, EventMountArg } from "@alphaday/ui-kit";
import moment from "moment";
import ReactGA from "react-ga4";
import { TEvent } from "src/api/types";
import { slugify } from "src/api/utils/textUtils";
import { calendarMessages } from "src/globalMessages";
import { Logger } from "../../api/utils/logging";

type EventMeta = {
    id: string;
    title: string;
    location: string;
};
export const getEventMeta: (
    e: EventMountArg | EventClickArg
) => EventMeta | undefined = (e) => {
    const { id } = e.event;
    const eventsMeta = e?.event?.source?.internalEventSource?.meta;

    if (eventsMeta == null || !Array.isArray(eventsMeta)) {
        Logger.warn(
            "calendarHelpers::getEventMeta: Could not retrieve eventsMeta"
        );
        return undefined;
    }

    const selectedEventMeta = eventsMeta.find(
        (item: { id: string }) => item.id === id
    );

    if (selectedEventMeta === undefined) {
        Logger.warn("calendarHelpers::getEventMeta: Could not retrieve event");
        return undefined;
    }

    return {
        id: selectedEventMeta.id,
        title: selectedEventMeta.title,
        location: selectedEventMeta.location,
    };
};

type TOnclickEvent = (
    eId: string,
    eUrlTitle: string,
    eventStart: string
) => void;

export const eventClickHandler = (
    e: EventClickArg,
    onClickEvent?: TOnclickEvent
): void => {
    const selectedEvent = getEventMeta(e);
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

export const getValidCalendarDateRange = () => {
    const today = new Date();
    const todayPlus2Years = new Date(
        // A large because this restricts month navigation
        today.getFullYear() + 2,
        today.getMonth(),
        0
    );

    return { start: today, end: todayPlus2Years };
};
