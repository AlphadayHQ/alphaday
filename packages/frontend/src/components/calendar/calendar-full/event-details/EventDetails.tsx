import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import moment from "moment-with-locales-es6";
import { TEventDetails } from "src/api/types";
import { getEventCategoryByType } from "src/api/utils/calendarUtils";
import { TEventCategory } from "src/components/types";
import globalMessages from "src/globalMessages";
import {
    EventDesc,
    EventLink,
    EventOrganizer,
    EventSpeakers,
} from "./components/parts";

interface IDetails {
    event: TEventDetails | undefined;
    eventFilters: TEventCategory[];
    isLoadingEventDetails: boolean;
}

const EventDetails: FC<IDetails> = ({
    event,
    eventFilters,
    isLoadingEventDetails,
}) => {
    const isEventFilteredOut = !eventFilters.some(
        (filter) => filter.value === event?.type
    );
    const noMatch = event !== undefined && isEventFilteredOut;
    const noEvent = event === undefined && !isLoadingEventDetails;

    if (noMatch || noEvent) {
        return (
            <div className="h-full bg-background">
                <div className="w-full h-full flex items-center justify-center bg-background text-primary fontGroup-highlightSemi">
                    {noMatch
                        ? globalMessages.queries.noMatchFound("events")
                        : globalMessages.queries.noResults}
                </div>
            </div>
        );
    }

    if (event && !isLoadingEventDetails) {
        const d = new Date(); // or whatever date you have
        const tzName = d
            .toLocaleString("en", { timeZoneName: "short" })
            .split(" ")
            .pop();
        const category = getEventCategoryByType(event.type, eventFilters);
        return (
            <div className="h-full bg-background">
                <div
                    className="relative pt-[10px] pr-4 pb-5 pl-5 border-b-0 flex flex-col rounded-tl rounded-tr"
                    key={event?.id}
                >
                    <p className="flex mx-0 mb-[10px] text-primaryVariant100 fontGroup-normal">
                        <span
                            className="w-[7px] h-[7px] m-0 mr-[5px] self-center block rounded-full flex-none order-0 flex-grow-0"
                            style={{
                                backgroundColor: category.color,
                            }}
                        />
                        <span
                            className="text-secondaryOrange self-center"
                            style={{
                                color: category.color,
                            }}
                        >
                            {category.label}
                        </span>
                        {event.location && (
                            <>
                                <span className="static w-[5px] h-[14px] fontGroup-support text-primaryVariant100 my-0 mx-[7px] self-center">
                                    •
                                </span>
                                <span>{event.location}</span>
                            </>
                        )}
                    </p>
                    <div className="fontGroup-major font-normal mt-[5px] mb-0 order-2 single-col:mt-0 single-col:order-1">
                        {event?.title}
                    </div>
                </div>
                <div className="pb-5 px-6">
                    <div>
                        <div className="row grid grid-cols-12 gap-5">
                            <div className="mb-4 three-col:col-span-8 col-span-6">
                                <div className="flex justify-center w-full h-[175px] bg-backgroundVariant300">
                                    <img
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={
                                            event?.image ||
                                            "https://i.imgur.com/SCDjoZb.jpg"
                                        }
                                        alt=""
                                    />
                                </div>
                                <br />
                                <EventDesc
                                    className="hidden three-col:block"
                                    event={event}
                                />
                            </div>
                            <div className="mb-4 three-col:col-span-4 col-span-6">
                                <div className="mb-[22px]">
                                    <div className="text-primaryVariant100">
                                        Start Date
                                    </div>
                                    <div className="flex flex-col text-primary fontGroup-normal">
                                        {`${String(
                                            moment(event?.start).format(
                                                "MMMM DD, YYYY"
                                            )
                                        )}`}
                                        <span className="text-primaryVariant100">
                                            {`${String(
                                                moment(event?.start).format(
                                                    "h:mmA"
                                                )
                                            )} (${String(tzName)})`}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-[22px]">
                                    <div className="text-primaryVariant100">
                                        End Date
                                    </div>
                                    <div className="flex flex-col text-primary fontGroup-normal">
                                        <span>
                                            {`${String(
                                                moment(event?.end).format(
                                                    "MMMM DD, YYYY"
                                                )
                                            )}`}
                                        </span>
                                        <span className="text-primaryVariant100">
                                            {`${String(
                                                moment(event?.end).format(
                                                    "h:mmA"
                                                )
                                            )} (${String(tzName)})`}
                                        </span>
                                    </div>
                                </div>
                                {event?.organizers?.length !== 0 && (
                                    <EventOrganizer
                                        className="hidden three-col:flex"
                                        event={event}
                                    />
                                )}
                                {event?.speakers?.length !== 0 && (
                                    <EventSpeakers
                                        className="hidden three-col:flex"
                                        event={event}
                                    />
                                )}
                            </div>
                        </div>
                        <EventDesc className="three-col:hidden" event={event} />
                        <div className="three-col:hidden row grid grid-cols-12 gap-5">
                            <div className="mb-4 col-span-6">
                                {event?.organizers?.length !== 0 && (
                                    <EventOrganizer event={event} />
                                )}
                                {event?.speakers?.length !== 0 && (
                                    <EventSpeakers event={event} />
                                )}
                            </div>
                        </div>
                        <div className="row grid grid-cols-12 gap-5">
                            <EventLink event={event} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="h-full bg-background">
            <ModuleLoader $height="500px" />
        </div>
    );
};

export default EventDetails;
