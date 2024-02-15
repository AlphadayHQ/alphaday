import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import { TSuperfeedItem } from "src/api/types";
import { ReactComponent as SpinnerSVG } from "src/assets/icons/spinners.svg";
import { ReactComponent as PauseSVG } from "src/assets/svg/pause2.svg";
import { ReactComponent as PlaySVG } from "src/assets/svg/play-audio.svg";
import { ReactComponent as SkipBackwardSVG } from "src/assets/svg/skip-backward.svg";
import { ReactComponent as SkipForwardSVG } from "src/assets/svg/skip-forward.svg";
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

interface IPodcastCard {
    item: TSuperfeedItem;
    selectedPodcast: TSuperfeedItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TSuperfeedItem | null>
    >;
}

// const SpinnerSVG = () => (
//     <svg
//         aria-hidden="true"
//         role="status"
//         className="inline mr-3 w-4 h-4 text-white animate-spin"
//         viewBox="0 0 100 101"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//     >
//         <path
//             d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//             className="fill-accentVariant100"
//         />
//         <path
//             d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//             className="fill-gray-400"
//         />
//     </svg>
// );

const PlayPauseButton: FC<{
    isPlaying: boolean;
    className?: string;
}> = ({ isPlaying, className }) => {
    return isPlaying ? (
        <PauseSVG
            className={twMerge(
                "w-4 h-4 text-primaryVariant100 group-hover:text-primary hover:text-primary",
                className
            )}
        />
    ) : (
        <PlaySVG
            className={twMerge(
                "w-4 h-4 text-primaryVariant100 group-hover:text-primary hover:text-primary",
                className
            )}
        />
    );
};

const parseProgressTime = (count: number) =>
    `${Math.floor(count / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })}:${Math.floor(count % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })}`;

export const PodcastCard: FC<IPodcastCard> = ({
    item,
    selectedPodcast,
    setSelectedPodcast,
}) => {
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
        duration,
    } = item;

    const {
        duration: currentDuration,
        percentComplete,
        position,
        seek,
    } = useAudioPosition();
    const {
        togglePlayPause,
        ready: isAudioReady,
        loading: isAudioLoading,
        playing: isAudioPlaying,
    } = useAudioPlayer({
        src: selectedPodcast?.fileUrl,
        format: "mp3",
        autoplay: true,
        html5: true,
    });

    const setPosition = (count: number) => {
        seek(position + count);
    };

    const isSelected = selectedPodcast?.id === item.id;

    const isReady = isAudioReady && isSelected;
    const isLoading = isAudioLoading && isSelected;
    const isPlaying = isAudioPlaying && isSelected;

    const handlePlay = (e: React.MouseEvent, open: boolean) => {
        if (!open || (open && !isReady)) e.stopPropagation();
        setSelectedPodcast(item);
        togglePlayPause();
    };

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
                                                />{" "}
                                            </p>
                                        </div>
                                    </div>
                                    <CardTitle title={title} />
                                    {isReady && open ? undefined : (
                                        <div
                                            className={twMerge(
                                                "flex items-center group border border-borderLine bg-backgroundVariant100 max-w-fit px-3 py-1 rounded-xl",
                                                open ? "mt-3" : "mt-2",
                                                isPlaying &&
                                                    !open &&
                                                    "bg-accentVariant200"
                                            )}
                                            onClick={(e) => handlePlay(e, open)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {isLoading && selectedPodcast ? (
                                                <SpinnerSVG />
                                            ) : (
                                                <PlayPauseButton
                                                    isPlaying={isPlaying}
                                                />
                                            )}
                                            <span
                                                className={twMerge(
                                                    "fontGroup-normal text-primaryVariant100 group-hover:text-primary",
                                                    isPlaying && "text-primary"
                                                )}
                                            >
                                                {duration}
                                            </span>
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
                                            src={image || undefined}
                                            alt=""
                                            className="w-14 h-14 rounded-lg object-cover"
                                            onError={imgOnError}
                                        />
                                    </div>
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
                        {isReady && (
                            <div className="flex justify-center">
                                <SkipForwardSVG
                                    onClick={() => setPosition(15)}
                                    className="w-6 h-6 text-primaryVariant100 hover:text-primary"
                                />
                                <div className="relative w-full min-w-[100px] px-2 flex  items-center justify-start">
                                    <div className="bg-backgroundVariant200 w-full h-1 rounded" />
                                    <div
                                        className="absolute bg-primaryVariant200 h-1 rounded"
                                        style={{ width: `${percentComplete}%` }}
                                    />
                                </div>
                                <SkipBackwardSVG
                                    onClick={() => setPosition(-15)}
                                    className="w-6 h-6 text-primaryVariant100 hover:text-primary"
                                />
                                <span className="fontGroup-mini whitespace-nowrap self-center text-primary mx-3">
                                    {parseProgressTime(position)} /{" "}
                                    {parseProgressTime(currentDuration)}
                                </span>
                                <span
                                    tabIndex={0}
                                    role="button"
                                    onClick={togglePlayPause}
                                    className="self-center"
                                >
                                    <PlayPauseButton
                                        className="w-5 h-5 cursor-pointer"
                                        isPlaying={isPlaying}
                                    />
                                </span>
                            </div>
                        )}
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
