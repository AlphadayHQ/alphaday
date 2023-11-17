import { FC } from "react";
import { Button, twMerge } from "@alphaday/ui-kit";
import DOMPurify from "dompurify";
import { TEventDetails } from "src/api/types";
import { ReactComponent as ExternalLinkSVG } from "src/assets/icons/external-link.svg";

export const EventOrganizer: FC<{
    event: TEventDetails;
    className?: string;
}> = ({ event, className }) => {
    return (
        <div
            className={twMerge("my-4 mx-0 flex flex-col", className)}
            data-tip="Event Organizer"
        >
            <div className="inline-block mt-[3px] mr-[3px] mb-0 ml-0">
                <div className="fontGroup-supportBold text-primaryVariant100 mb-[3px]">
                    Organizers
                </div>
            </div>
            <span className="text-primary fontGroup-normal">
                {event.organizers.join(", ")}
            </span>
        </div>
    );
};

export const EventSpeakers: FC<{
    event: TEventDetails;
    className?: string;
}> = ({ event, className }) => {
    return (
        <div className={twMerge("my-4 mx-0 flex flex-col", className)}>
            <div className="label">
                <div className="fontGroup-supportBold text-primaryVariant100 mb-[3px]">
                    Speakers
                </div>
            </div>
            <span className="text-primary fontGroup-normal">
                {event.speakers.join(", ")}
            </span>
        </div>
    );
};

export const EventLink: FC<{ event: TEventDetails }> = ({ event }) => {
    return (
        <a href={event.eventRegLink} target="_blank" rel="noreferrer">
            <Button className="min-w-max" variant="secondary">
                <span className="text-primary">
                    <ExternalLinkSVG className="w-3.5 h-3.5 pt-[1px] text-primaryVariant100 stroke-3" />
                </span>
                <span className="pt-0.5 min-w-full whitespace-nowrap">
                    More Details
                </span>
            </Button>
        </a>
    );
};

export const EventDesc: FC<{ event: TEventDetails; className?: string }> = ({
    event,
    className,
}) => {
    return (
        <div
            className={twMerge(
                "mt-[5px] text-primary break-word mb-4 fontGroup-normal [&_*]:text-primary",
                className
            )}
        >
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
