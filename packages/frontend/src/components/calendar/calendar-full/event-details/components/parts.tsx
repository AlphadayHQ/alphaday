import { FC } from "react";
import { Button } from "@alphaday/ui-kit";
import DOMPurify from "dompurify";
import { TEventDetails } from "src/api/types";
import { ExternalLinkSVG, MapSVG, GlobeSVG } from "./icons";

export const EventOrganizer: FC<{ event: TEventDetails }> = ({ event }) => {
    return (
        <div className="my-4 mx-0 flex flex-col" data-tip="Event Organizer">
            <div className="inline-block mt-[3px] mr-[3px] mb-0 ml-0">
                <div className="fontGroup-supportBold mb-[3px]">Organizers</div>
            </div>
            <span className="text-primary fontGroup-normal">
                {event.organizers.join(", ")}
            </span>
        </div>
    );
};

export const EventSpeakers: FC<{
    event: TEventDetails;
}> = ({ event }) => {
    return (
        <div className="my-4 mx-0 flex flex-col">
            <div className="label">
                <div className="fontGroup-supportBold mb-[3px]">Speakers</div>
            </div>
            <span className="text-primary fontGroup-normal">
                {event.speakers.join(", ")}
            </span>
        </div>
    );
};

export const EventLocation: FC<{ event: TEventDetails }> = ({ event }) => {
    return (
        <div className="my-4 mx-0">
            <div
                className="fontGroup-supportBold mb-[3px]"
                data-tip="Event Location"
            >
                {event.location?.toLowerCase() !== "online" ? (
                    <>
                        <MapSVG />
                        {["TBD", "TBC", "ONCHAIN"].includes(
                            String(event.location)?.toUpperCase()
                        ) ? (
                            <span className="ml-1 normal-case fontGroup-normal">
                                {event.location}
                            </span>
                        ) : (
                            <a
                                href={`https://www.google.com/maps/search/${String(
                                    event.location?.split(" ").join("+")
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-1 normal-case fontGroup-normal"
                            >
                                {event.location}
                            </a>
                        )}
                    </>
                ) : (
                    <>
                        <GlobeSVG />
                        <span className="ml-1 normal-case fontGroup-normal">
                            Virtual
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export const EventLink: FC<{ event: TEventDetails }> = ({ event }) => {
    return (
        <a href={event.eventRegLink} target="_blank" rel="noreferrer">
            <Button className="min-w-max" variant="secondary">
                <span className="text-primary">
                    <ExternalLinkSVG />
                </span>
                <span className="pt-[3.5px] pl-[5px] min-w-full whitespace-nowrap">
                    More Details
                </span>
            </Button>
        </a>
    );
};

export const EventDesc: FC<{ event: TEventDetails }> = ({ event }) => {
    return (
        <div className="mt-[5px] text-primary break-word mb-4 fontGroup-normal [&_*]:text-primary">
            <span
                // DOMPurify will 100% secure dangerouslySetInnerHTML
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.description || ""),
                }}
                className="nine-liner"
            />
        </div>
    );
};
