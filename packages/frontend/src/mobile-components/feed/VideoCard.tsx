import { FC, MouseEventHandler } from "react";
import { TSuperfeedItem } from "src/api/types";
import { ReactComponent as PlaySVG } from "src/assets/svg/play-video.svg";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
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
import { feedItemIconMap } from "./types";

const VideoPlaceholder: FC<{
    url: string | undefined;
    onPlayVideo: MouseEventHandler<SVGSVGElement>;
}> = ({ url, onPlayVideo }) => (
    <div className="relative">
        <img
            src={url}
            alt=""
            className="w-full h-24 rounded-lg object-cover"
            onError={imgOnError}
        />
        <PlaySVG
            onClick={onPlayVideo}
            className="absolute inset-0 mx-auto my-auto"
        />
    </div>
);

export const VideoCard: FC<{ item: TSuperfeedItem }> = ({ item }) => {
    const {
        title,
        tags,
        likes,
        comments,
        sourceName,
        sourceIcon,
        date,
        url,
        image,
        type,
        shortDescription,
    } = item;

    const onLike = () => {};
    const isLiked = false;

    return (
        <FeedItemDisclosure>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton open={open}>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FeedItemDisclosureButtonImage
                                            icon={feedItemIconMap[type]}
                                        />
                                        <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                                {computeDuration(date)}
                                                <span className="mx-1.5 my-0 self-center">
                                                    •
                                                </span>{" "}
                                                <FeedSourceInfo
                                                    name={sourceName}
                                                    img={sourceIcon}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <CardTitle title={title} />
                                </div>
                                <div className="flex-col min-w-max ml-2">
                                    {open ? null : (
                                        <VideoPlaceholder
                                            url={image || undefined}
                                            onPlayVideo={onLike}
                                        />
                                    )}
                                </div>
                            </div>
                            {!open && (
                                <div className="flex justify-between">
                                    <div className="flex-col">
                                        <TagButtons
                                            truncated
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
                        <video
                            className="mb-2 rounded bg-backgroundVariant200"
                            onError={() => {}}
                        >
                            <source src={url} />
                            <track kind="captions" label="English" />
                        </video>
                        <p className="m-0 text-primaryVariant100 line-clamp-4">
                            {shortDescription}
                        </p>
                        <a
                            href={url}
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
