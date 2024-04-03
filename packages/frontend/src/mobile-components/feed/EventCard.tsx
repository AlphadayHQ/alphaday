import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import DOMPurify from "dompurify";
import moment from "moment";
import { TSuperfeedItem } from "src/api/types";
import { TagButton } from "src/mobile-components/button/buttons";
import { imgOnError } from "src/utils/errorHandling";
import {
    ActionButtons,
    CardTitle,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    ReadMoreLink,
    TagButtons,
    getFeedItemIcon,
} from "./FeedElements";

const eventDateFormatter = (date: string) => {
    const d = new Date(); // or whatever date you have
    const tzName = d
        .toLocaleString("en", { timeZoneName: "short" })
        .split(" ")
        .pop();
    return (
        <span className="flex flex-col text-primary fontGroup-mini">
            <span>
                {`${String(moment(date).format("MMM DD, YYYY"))}`}
                <span className="mx-1 my-0 self-center">•</span>
                <span>
                    {`${String(moment(date).format("h:mmA"))} (${String(
                        tzName
                    )})`}
                </span>
            </span>
        </span>
    );
};

export const EventCard: FC<{
    item: TSuperfeedItem;
    isAuthenticated: boolean;
    onLike: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
    onClick: () => MaybeAsync<void>;
}> = ({ item, onLike, onShare, onClick, isAuthenticated }) => {
    const {
        title,
        tags,
        likes,
        comments,
        url,
        image,
        type,
        shortDescription,
        startsAt,
        endsAt,
    } = item;

    const location = item.data?.location;
    const category = "category";

    return (
        <FeedItemDisclosure onClick={onClick}>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between">
                                <div className="inline-block">
                                    <div className="flex items-center min-w-max">
                                        <FeedItemDisclosureButtonImage
                                            icon={getFeedItemIcon(type)}
                                        />
                                        <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            <div className="flex flex-col text-primary [&_span]:text-primaryVariant100 fontGroup-mini">
                                                {startsAt &&
                                                    eventDateFormatter(
                                                        startsAt
                                                    )}
                                                {endsAt &&
                                                    eventDateFormatter(endsAt)}
                                            </div>
                                        </div>
                                    </div>
                                    {!open && (
                                        <>
                                            <CardTitle title={title} />
                                            {location && (
                                                <p className="mt-0.5 mb-0 line-clamp-2">
                                                    {location}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex-col min-w-max ml-2">
                                    <div
                                        className={twMerge(
                                            "w-full flex items-start",
                                            open && "hidden"
                                        )}
                                    >
                                        <img
                                            src={image || undefined}
                                            alt=""
                                            className="h-24 max-w-[120px] rounded-lg object-cover"
                                            onError={imgOnError}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <img
                            src={image || undefined}
                            alt=""
                            className="w-full rounded-lg object-cover"
                            onError={imgOnError}
                        />
                        <p className="mt-2 mb-1 fontGroup-highlight line-clamp-3">
                            {title}
                        </p>
                        {location && (
                            <p className="mt-0.5 mb-0 line-clamp-2">
                                {location}
                            </p>
                        )}
                        <p
                            // DOMPurify will 100% secure dangerouslySetInnerHTML
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    shortDescription || ""
                                ),
                            }}
                            className="m-0 text-primaryVariant100 prose-p:text-primaryVariant100 prose-a:text-secondaryOrange50 line-clamp-4"
                        />
                        <ReadMoreLink url={url} />
                    </FeedItemDisclosurePanel>
                    <div className="flex justify-between my-2">
                        <div className="flex-col">
                            <div className="flex-col">
                                <TagButton
                                    className="bg-[#C1DF91] text-background mt-3"
                                    name={category}
                                    onClick={() => {}}
                                />
                            </div>
                            {open && (
                                <TagButtons
                                    truncated
                                    tags={tags}
                                    onClick={() => {}}
                                />
                            )}
                        </div>
                        <div className="flex-col min-w-max ml-2">
                            <ActionButtons
                                isAuthenticated={isAuthenticated}
                                onLike={onLike}
                                onCommentClick={onLike}
                                onShare={onShare}
                                likes={likes}
                                comments={comments}
                                isLiked={item.isLiked}
                            />
                        </div>
                    </div>
                </>
            )}
        </FeedItemDisclosure>
    );
};
