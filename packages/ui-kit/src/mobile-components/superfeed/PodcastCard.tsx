import { FC } from "react";
import { ReactComponent as PauseSVG } from "src/assets/svg/pause2.svg";
import { ReactComponent as PlayAudioSVG } from "src/assets/svg/play-audio.svg";
import { ReactComponent as SkipBackwardSVG } from "src/assets/svg/skip-backward.svg";
import { ReactComponent as SkipForwardSVG } from "src/assets/svg/skip-forward.svg";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import {
    ActionButtons,
    CardTitle,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    FeedSourceInfo,
    TagButtons,
} from "./FeedElements";
import { IPodcastFeedItem, feedIcons } from "./types";

export const PodcastCard: FC<{ item: IPodcastFeedItem }> = ({ item }) => {
    const {
        title,
        date,
        tags,
        likes,
        comments,
        link,
        img,
        type,
        description,
        source,
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
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FeedItemDisclosureButtonImage
                                            icon={feedIcons[type]}
                                        />
                                        <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                                {computeDuration(date)}
                                                <span className="mx-1.5 my-0 self-center">
                                                    •
                                                </span>{" "}
                                                <FeedSourceInfo
                                                    name={source.name}
                                                    img={source.img}
                                                />{" "}
                                            </p>
                                        </div>
                                    </div>
                                    <CardTitle title={title} />
                                    {open ? undefined : (
                                        <div className="flex items-center mt-1">
                                            <PlayAudioSVG className="w-6 h-6 mr-1.5 text-primary" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-col min-w-max ml-2">
                                    <div
                                        className={twMerge(
                                            "w-full flex justify-end items-start",
                                            open ? "" : "h-24"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-14 h-14 rounded-lg object-cover"
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
                        <div className="flex justify-center">
                            <SkipForwardSVG className="w-6 h-6 text-primaryVariant100" />
                            <div className="relative w-full min-w-[100px] px-2 flex  items-center justify-start">
                                <div className="bg-backgroundVariant200 w-full h-1 rounded" />
                                <div className="absolute bg-primaryVariant200 w-12 h-1 rounded" />
                            </div>
                            <SkipBackwardSVG className="w-6 h-6 mr-1.5 text-primaryVariant100" />
                            <span className="fontGroup-mini self-center text-primary mr-1.5">
                                3:37
                            </span>
                            <PauseSVG className="w-6 h-6 mr-1.5 text-primary" />
                        </div>{" "}
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
                            <TagButtons tags={tags} onClick={() => {}} />
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
