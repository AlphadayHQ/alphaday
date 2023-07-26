/* eslint-disable @typescript-eslint/no-unsafe-return */
import chroma from "chroma-js";
import moment from "moment";
import { TRemoteEvent, TRemoteEventDetails } from "src/api/services";
import { TEvent, TEventDetails } from "src/api/types";
import {
    defaultEventCategory,
    typeOptions,
} from "src/components/calendarCategories";
import { TEventCategory } from "src/components/types";
import { Logger } from "./logging";

/*
 * Maps category value -> { default: <color>, dark: <drakened-color> }.
 * eg.
 * "ICO": {
 *    backgroundColor: "rgb(144, 190, 109)"
 *    borderColor:  chroma(rgb(144, 190, 109)).darken(0.7).css(),
 */
const eventColorDict: {
    [key: string]: { backgroundColor: string; borderColor: string };
} = typeOptions.reduce(
    (acc, curr) => ({
        ...acc,
        [curr.value.toLowerCase()]: {
            backgroundColor: curr.color,
            borderColor: chroma(curr.color).darken(0.7).css(),
        },
    }),
    {}
);

export const getEventCategoryByType = (
    itemType: string | undefined,
    options: TEventCategory[]
): TEventCategory => {
    if (itemType !== undefined) {
        const category = options.find(
            (cat) => cat.value.toLowerCase() === itemType.toLowerCase()
        );
        if (category !== undefined) return category;
        Logger.warn("could not find event category", itemType);
    }
    return defaultEventCategory;
};

export const getEventCategoryByColor = (
    color: string | undefined,
    options: TEventCategory[]
): TEventCategory => {
    if (color !== undefined) {
        const category = options.find((cat) => cat.color === color);
        if (category !== undefined) return category;
        Logger.warn("could not find event category");
    }
    return defaultEventCategory;
};

const assignEventColors: (itemType: string | undefined) => {
    backgroundColor: string;
    borderColor: string;
} = (itemType) => {
    let colors;
    if (itemType !== undefined) {
        colors = eventColorDict[itemType.toLowerCase()];
        if (colors !== undefined) return colors;
    }
    return {
        backgroundColor: defaultEventCategory.color,
        borderColor: chroma(defaultEventCategory.color).darken(0.7).css(),
    };
};

export const reshapeEvents: (events: TRemoteEvent[]) => TEvent[] = (events) => {
    const reshaped: TEvent[] = events
        .map((e) => ({
            id: String(e.id),
            eventRegLink: e.url,
            title: e.title,
            source: e.source,
            type: e.item_type === "***" ? "Unfiltered" : e.item_type,
            start: e.starts_at
                ? moment(e.starts_at).format("YYYY-MM-DDTHH:mmZ").toString()
                : "",
            end: e.ends_at
                ? String(e.ends_at)
                : String(
                      moment(e.starts_at)
                          .add(1, "d")
                          .format("YYYY-MM-DDTHH:mmZ")
                  ),
            allDay: false,
            location: e.location || "",
            ...assignEventColors(e.item_type),
        }))
        .filter((e) => e.start !== "");
    return [...reshaped];
};
export const reshapeEventsDetails: (
    event: TRemoteEventDetails
) => TEventDetails = (event) => {
    const reshaped: TEventDetails = {
        id: String(event.id),
        eventRegLink: event.url,
        title: event.title,
        source: event.source,
        description: event.description,
        type: event.item_type,
        start: event.starts_at
            ? moment(event.starts_at).format("YYYY-MM-DDTHH:mmZ").toString()
            : "",
        // if ends_at is undefined, default to 24h
        end: event.ends_at
            ? String(event.ends_at)
            : String(
                  moment(event.starts_at)
                      .add(1, "d")
                      .format("YYYY-MM-DDTHH:mmZ")
              ),
        allDay: moment(event.ends_at).diff(moment(event.starts_at), "days") > 0,
        location: event.location || "",
        image: event.image,
        visible: event.is_approved,
        blockNumber: event.block_number,
        price: event.price,
        organizers: event.organizers.map((o) => o.name),
        speakers: event.speakers.map((speaker) => speaker.name),
        ...assignEventColors(event.item_type),
    };
    return reshaped;
};

export const getClosestEvent = (
    events: TEvent[] | undefined,
    date: Date
): TEvent | undefined => {
    let minDiff = 768; // 24h * 32days so at least an event matches
    let nearestEvent;

    if (events)
        events.forEach((event) => {
            const diff = moment(date).diff(moment(event.start), "hours");
            const diffAbs = Math.abs(diff);
            if (diff < 0 && diffAbs < minDiff) {
                minDiff = diffAbs;
                nearestEvent = event;
            }
        });
    return nearestEvent;
};

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

interface TElemCoords {
    top: number;
    left: number;
    right: number;
}

/**
 * get the coordinates of an element relative to the document
 * @param elem
 * @returns TElemCoords
 */
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
