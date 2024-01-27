import { FC } from "react";
import moment from "moment";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import { TagButton } from "../button/buttons";
import {
    ActionButtons,
    CardTitle,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    TagButtons,
} from "./FeedElements";
import { IEventFeedItem, feedIcons } from "./types";

const eventDateFormatter = (date: Date) => {
    const d = new Date(); // or whatever date you have
    const tzName = d
        .toLocaleString("en", { timeZoneName: "short" })
        .split(" ")
        .pop();
    return (
        <span className="flex flex-col text-primary fontGroup-mini">
            <span>
                {`${String(moment(date).format("MMM DD, YYYY"))}`}
                <span className="mx-1.5 my-0 self-center">•</span>
                <span>
                    {`${String(moment(date).format("h:mmA"))} (${String(
                        tzName
                    )})`}
                </span>
            </span>
        </span>
    );
};

export const EventCard: FC<{ item: IEventFeedItem }> = ({ item }) => {
    const {
        title,
        tags,
        likes,
        comments,
        link,
        img,
        type,
        description,
        category,
        location,
        startDate,
        endDate,
    } = item;

    const onLike = () => {};
    const isLiked = false;

    return (
        <FeedItemDisclosure>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton open={open}>
                        <div className="flex flex-col">
                            <div className="flex">
                                <div className="flex-col">
                                    <div className="flex items-center">
                                        <FeedItemDisclosureButtonImage
                                            icon={feedIcons[type]}
                                        />
                                        <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            <div className="flex flex-col text-primary fontGroup-mini">
                                                {eventDateFormatter(startDate)}
                                                {eventDateFormatter(endDate)}
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle title={title} />
                                    <p className="mt-0.5 mb-0 line-clamp-2">
                                        {location}
                                    </p>
                                    {!open && (
                                        <TagButton
                                            className="bg-[#C1DF91] text-background mt-3"
                                            name={category}
                                            onClick={() => {}}
                                        />
                                    )}
                                </div>
                                <div className="flex-col min-w-max ml-2">
                                    <div
                                        className={twMerge(
                                            "w-full flex justify-end items-start",
                                            open && "hidden"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="h-24 rounded-lg object-cover"
                                            onError={imgOnError}
                                        />
                                    </div>
                                </div>
                            </div>
                            {!open && (
                                <div className="flex">
                                    <div className="flex-col">
                                        <TagButtons
                                            tags={tags}
                                            onClick={() => {}}
                                        />
                                    </div>
                                    <div className="flex-col min-w-max ml-2">
                                        <ActionButtons
                                            onLike={onLike}
                                            onCommentClick={onLike}
                                            onShare={onLike}
                                            likes={likes}
                                            comments={comments}
                                            isLiked={isLiked}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <img
                            src={img}
                            alt=""
                            className="w-full rounded-lg object-cover"
                            onError={imgOnError}
                        />
                        <p className="mt-2 mb-0 fontGroup-highlight line-clamp-3">
                            {title}
                        </p>
                        <p className="mt-0.5 mb-0 line-clamp-2">{location}</p>
                        <p className="m-0 text-primaryVariant100 line-clamp-4">
                            {description}
                        </p>
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:underline fontGroup-supportBold mb-0 mt-0.5 leading-5 [text-underline-offset:_6px]"
                        >
                            Read more
                        </a>
                        <div className="my-2 flex justify-between">
                            <div className="flex flex-col">
                                <TagButton
                                    className="bg-[#C1DF91] text-background mt-3"
                                    name={category}
                                    onClick={() => {}}
                                />
                                <TagButtons tags={tags} onClick={() => {}} />
                            </div>
                            <div className="min-w-max ml-2 mt-0.5">
                                <ActionButtons
                                    onLike={onLike}
                                    onCommentClick={onLike}
                                    onShare={onLike}
                                    likes={likes}
                                    comments={comments}
                                    isLiked={isLiked}
                                />
                            </div>
                        </div>
                    </FeedItemDisclosurePanel>
                </>
            )}
        </FeedItemDisclosure>
    );
};
