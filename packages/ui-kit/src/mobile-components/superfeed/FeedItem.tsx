import { FC } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import newsIcon from "src/assets/feedIcons/news.png";
import { ReactComponent as CommentSVG } from "src/assets/svg/comment.svg";
import { ReactComponent as LikeSVG } from "src/assets/svg/like.svg";
import { ReactComponent as LikedSVG } from "src/assets/svg/liked.svg";
import { ReactComponent as ShareSVG } from "src/assets/svg/share.svg";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import { ActionButton, TagButton } from "../button/buttons";

const feedIcons = {
    news: newsIcon,
};

interface IFeedItem {
    id: number;
    type: "news";
    title: string;
    date: Date;
    source: {
        name: string;
        img: string;
    };
    tags: string[];
    likes: number;
    comments: number;
    link: string;
    img: string;
    description: string;
}

const ActionButtons: FC<{
    onLike: () => void;
    onCommentClick: () => void;
    onShare: () => void;
    likes: number;
    comments: number;
    isLiked: boolean;
}> = ({ onLike, onCommentClick, onShare, isLiked, likes, comments }) => (
    <div className="flex mt-2">
        <ActionButton onClick={onLike}>
            {isLiked ? (
                <LikedSVG className="w-3 h-3 pt-[1px]" />
            ) : (
                <LikeSVG className="w-3 h-3 pt-[1px]" />
            )}{" "}
            <span className="ml-0.5">{likes}</span>
        </ActionButton>
        <ActionButton onClick={onCommentClick}>
            <CommentSVG className="w-3 h-3 pt-[1px]" />
            <span className="ml-0.5">{comments}</span>
        </ActionButton>
        <ActionButton onClick={onShare}>
            <ShareSVG className="w-3 h-3 pt-[1px]" />
        </ActionButton>
    </div>
);

const TagButtons: FC<{ tags: string[]; onClick: () => void }> = ({
    tags,
    onClick,
}) => (
    <div className="mt-2.5 flex flex-wrap">
        {tags.map((tag) => (
            <TagButton key={tag} name={tag} onClick={onClick} />
        ))}
    </div>
);

export const FeedItem: FC<{ item: IFeedItem }> = ({
    item: {
        title,
        date,
        source,
        tags,
        likes,
        comments,
        link,
        img,
        type,
        description,
    },
}) => {
    const handleLike = () => {};
    const isLiked = false;

    return (
        <div className="border-b border-borderLine">
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={twMerge(
                                "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
                                open ? "" : "mb-2"
                            )}
                        >
                            <div className="flex-col">
                                <div className="flex items-center">
                                    <img
                                        src={feedIcons[type]}
                                        alt="feed icon"
                                        className="w-8 h-8 mr-2"
                                    />
                                    <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                        {computeDuration(date)}
                                        <span className="mx-1.5 my-0 self-center">
                                            •
                                        </span>{" "}
                                        <span>
                                            <span className="capitalize">
                                                {source.name}
                                            </span>
                                            <img
                                                src={source.img}
                                                alt=""
                                                className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
                                                onError={imgOnError}
                                            />
                                        </span>
                                    </p>
                                </div>
                                <p className="mt-2 mb-0 three-liner">{title}</p>
                                {!open && (
                                    <TagButtons
                                        tags={tags}
                                        onClick={() => {}}
                                    />
                                )}
                            </div>
                            <div className="flex-col min-w-max ml-2">
                                <img
                                    src={img}
                                    alt=""
                                    className="w-full h-24 rounded-lg object-cover"
                                    onError={imgOnError}
                                />
                                {!open && (
                                    <ActionButtons
                                        onLike={handleLike}
                                        onCommentClick={handleLike}
                                        onShare={handleLike}
                                        likes={likes}
                                        comments={comments}
                                        isLiked={isLiked}
                                    />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel className="pt-2 text-primaryVariant100 four-liner fontGroup-normal">
                                <p className="m-0 text-primaryVariant100">
                                    {description}
                                </p>
                                <a
                                    href={link}
                                    className="underline hover:underline fontGroup-supportBold mb-0 mt-0.5 leading-5 [text-underline-offset:_6px]"
                                >
                                    Read more
                                </a>
                                <div className="my-2 flex justify-between">
                                    <div className="flex-col">
                                        <TagButtons
                                            tags={tags}
                                            onClick={() => {}}
                                        />
                                    </div>
                                    <div className="flex-col min-w-max ml-2">
                                        <ActionButtons
                                            onLike={handleLike}
                                            onCommentClick={handleLike}
                                            onShare={handleLike}
                                            likes={likes}
                                            comments={comments}
                                            isLiked={isLiked}
                                        />
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
};
