import { FC, MouseEventHandler } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ReactComponent as CommentSVG } from "src/assets/svg/comment.svg";
import { ReactComponent as LikeSVG } from "src/assets/svg/like.svg";
import { ReactComponent as LikedSVG } from "src/assets/svg/liked.svg";
import { ReactComponent as PlaySVG } from "src/assets/svg/play-video.svg";
import { ReactComponent as ShareSVG } from "src/assets/svg/share.svg";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import { ActionButton, TagButton } from "../button/buttons";
import {
    EFeedItemType,
    IFeedItem,
    INewsFeedItem,
    IVideoFeedItem,
    feedIcons,
} from "./types";

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

const VideoPlaceholder: FC<{
    img: string;
    onPlayVideo: MouseEventHandler<SVGSVGElement>;
}> = ({ img, onPlayVideo }) => (
    <div className="relative">
        <img
            src={img}
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

const NewsCollpasedMedia: FC<{
    img: string;
}> = ({ img }) => (
    <img
        src={img}
        alt=""
        className="w-full h-24 rounded-lg object-cover"
        onError={imgOnError}
    />
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

// export const FeedItem = ({ item }: { item: IFeedItem }) => {
//     const { title, date, tags, likes, comments, link, img, type, description } =
//         item;

//     const hasSource = "source" in item;
//     const isVideo = type === EFeedItemType.VIDEO;

//     const handlePlayVideo: MouseEventHandler<SVGSVGElement> = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//     };

//     const handleLike = () => {};
//     const isLiked = false;

//     return (
//         <div className="border-b border-borderLine">
//             <Disclosure>
//                 {({ open }) => (
//                     <>
//                         <Disclosure.Button
//                             className={twMerge(
//                                 "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
//                                 open ? "" : "mb-2"
//                             )}
//                         >
//                             <div className="flex-col">
//                                 <div className="flex items-center">
//                                     <img
//                                         src={feedIcons[type]}
//                                         alt="feed icon"
//                                         className="w-8 h-8 mr-2"
//                                     />
//                                     <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
//                                         {computeDuration(date)}
//                                         <span className="mx-1.5 my-0 self-center">
//                                             •
//                                         </span>{" "}
//                                         {hasSource && (
//                                             <span>
//                                                 <span className="capitalize">
//                                                     {item.source.name}
//                                                 </span>
//                                                 <img
//                                                     src={item.source.img}
//                                                     alt=""
//                                                     className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
//                                                     onError={imgOnError}
//                                                 />
//                                             </span>
//                                         )}
//                                     </p>
//                                 </div>
//                                 <p className="mt-2 mb-0 line-clamp-3">{title}</p>
//                                 {!open && (
//                                     <TagButtons
//                                         tags={tags}
//                                         onClick={() => {}}
//                                     />
//                                 )}
//                             </div>
//                             <div className="flex-col min-w-max ml-2">
//                                 <div className="relative">
//                                     <img
//                                         src={img}
//                                         alt=""
//                                         className="w-full h-24 rounded-lg object-cover"
//                                         onError={imgOnError}
//                                     />
//                                     <PlaySVG
//                                         onClick={handlePlayVideo}
//                                         className="absolute inset-0 mx-auto my-auto"
//                                     />
//                                 </div>
//                                 {!open && (
//                                     <ActionButtons
//                                         onLike={handleLike}
//                                         onCommentClick={handleLike}
//                                         onShare={handleLike}
//                                         likes={likes}
//                                         comments={comments}
//                                         isLiked={isLiked}
//                                     />
//                                 )}
//                             </div>
//                         </Disclosure.Button>
//                         <Transition
//                             enter="transition duration-100 ease-out"
//                             enterFrom="transform scale-95 opacity-0"
//                             enterTo="transform scale-100 opacity-100"
//                             leave="transition duration-75 ease-out"
//                             leaveFrom="transform scale-100 opacity-100"
//                             leaveTo="transform scale-95 opacity-0"
//                         >
//                             <Disclosure.Panel className="pt-2 text-primaryVariant100 line-clamp-4 fontGroup-normal">
//                                 <p className="m-0 text-primaryVariant100">
//                                     {description}
//                                 </p>
//                                 <a
//                                     href={link}
//                                     className="underline hover:underline fontGroup-supportBold mb-0 mt-0.5 leading-5 [text-underline-offset:_6px]"
//                                 >
//                                     Read more
//                                 </a>
//                                 <div className="my-2 flex justify-between">
//                                     <div className="flex-col">
//                                         <TagButtons
//                                             tags={tags}
//                                             onClick={() => {}}
//                                         />
//                                     </div>
//                                     <div className="flex-col min-w-max ml-2">
//                                         <ActionButtons
//                                             onLike={handleLike}
//                                             onCommentClick={handleLike}
//                                             onShare={handleLike}
//                                             likes={likes}
//                                             comments={comments}
//                                             isLiked={isLiked}
//                                         />
//                                     </div>
//                                 </div>
//                             </Disclosure.Panel>
//                         </Transition>
//                     </>
//                 )}
//             </Disclosure>
//         </div>
//     );
// };

// export const FeedItem: FC<{
//     buttonChild: ReactNode;
//     panelChild: ReactNode;
// }> = () => {
//     const { title, date, tags, likes, comments, link, img, type, description } =
//         item;

//     const handlePlayVideo: MouseEventHandler<SVGSVGElement> = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//     };

//     const handleLike = () => {};
//     const isLiked = false;

//     return (
//         <div className="border-b border-borderLine">
//             <Disclosure>
//                 {({ open }) => (
//                     <>
//                         <Disclosure.Button
//                             className={twMerge(
//                                 "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
//                                 open ? "" : "mb-2"
//                             )}
//                         >
//                             buttonChild(computeDuration)
//                             <div className="flex-col">
//                                 <div className="flex items-center">
//                                     <img
//                                         src={feedIcons[type]}
//                                         alt="feed icon"
//                                         className="w-8 h-8 mr-2"
//                                     />
//                                     <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
//                                         {computeDuration(date)}
//                                         <span className="mx-1.5 my-0 self-center">
//                                             •
//                                         </span>{" "}
//                                         {hasSource && (
//                                             <span>
//                                                 <span className="capitalize">
//                                                     {item.source.name}
//                                                 </span>
//                                                 <img
//                                                     src={item.source.img}
//                                                     alt=""
//                                                     className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
//                                                     onError={imgOnError}
//                                                 />
//                                             </span>
//                                         )}
//                                     </p>
//                                 </div>
//                                 <p className="mt-2 mb-0 line-clamp-3">{title}</p>
//                                 {!open && (
//                                     <TagButtons
//                                         tags={tags}
//                                         onClick={() => {}}
//                                     />
//                                 )}
//                             </div>
//                             <div className="flex-col min-w-max ml-2">
//                                 <div className="relative">
//                                     <img
//                                         src={img}
//                                         alt=""
//                                         className="w-full h-24 rounded-lg object-cover"
//                                         onError={imgOnError}
//                                     />
//                                     <PlaySVG
//                                         onClick={handlePlayVideo}
//                                         className="absolute inset-0 mx-auto my-auto"
//                                     />
//                                 </div>
//                                 {!open && (
//                                     <ActionButtons
//                                         onLike={handleLike}
//                                         onCommentClick={handleLike}
//                                         onShare={handleLike}
//                                         likes={likes}
//                                         comments={comments}
//                                         isLiked={isLiked}
//                                     />
//                                 )}
//                             </div>
//                         </Disclosure.Button>
//                         <Transition
//                             enter="transition duration-100 ease-out"
//                             enterFrom="transform scale-95 opacity-0"
//                             enterTo="transform scale-100 opacity-100"
//                             leave="transition duration-75 ease-out"
//                             leaveFrom="transform scale-100 opacity-100"
//                             leaveTo="transform scale-95 opacity-0"
//                         >
//                             <Disclosure.Panel className="pt-2 text-primaryVariant100 line-clamp-4 fontGroup-normal">
//                                 triggerChild(onLike, onShare, onCommentClick)
//                                 <p className="m-0 text-primaryVariant100">
//                                     {description}
//                                 </p>
//                                 <a
//                                     href={link}
//                                     className="underline hover:underline fontGroup-supportBold mb-0 mt-0.5 leading-5 [text-underline-offset:_6px]"
//                                 >
//                                     Read more
//                                 </a>
//                                 <div className="my-2 flex justify-between">
//                                     <div className="flex-col">
//                                         <TagButtons
//                                             tags={tags}
//                                             onClick={() => {}}
//                                         />
//                                     </div>
//                                     <div className="flex-col min-w-max ml-2">
//                                         <ActionButtons
//                                             onLike={handleLike}
//                                             onCommentClick={handleLike}
//                                             onShare={handleLike}
//                                             likes={likes}
//                                             comments={comments}
//                                             isLiked={isLiked}
//                                         />
//                                     </div>
//                                 </div>
//                             </Disclosure.Panel>
//                         </Transition>
//                     </>
//                 )}
//             </Disclosure>
//         </div>
//     );
// };

const FeedItemDisclosure: FC<{
    children: ({ open }: { open: boolean }) => JSX.Element;
}> = ({ children }) => {
    return (
        <div className="border-b border-borderLine">
            <Disclosure>{({ open }) => children({ open })}</Disclosure>
        </div>
    );
};

const FeedSourceInfo = ({ name, img }: { name: string; img: string }) => {
    return (
        <span>
            <span className="capitalize">{name}</span>
            <img
                src={img}
                alt=""
                className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
                onError={imgOnError}
            />
        </span>
    );
};

const FeedItemDisclosureButton: FC<{
    open: boolean;
    icon: string;
    date: string;
    title: string;
    feedIconElement: JSX.Element;
    bannerImgArea: JSX.Element | null;
    tags: string[];
    onLike: () => void;
    likes: number;
    comments: number;
    isLiked: boolean;
}> = ({
    open,
    icon,
    date,
    title,
    feedIconElement,
    bannerImgArea,
    tags,
    onLike,
    likes,
    comments,
    isLiked,
}) => {
    return (
        <Disclosure.Button
            className={twMerge(
                "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
                open ? "" : "mb-2"
            )}
        >
            <div className="flex-col">
                <div className="flex items-center">
                    <img src={icon} alt="feed icon" className="w-8 h-8 mr-2" />
                    <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                        {date}
                        <span className="mx-1.5 my-0 self-center">•</span>{" "}
                        {feedIconElement}
                    </p>
                </div>
                <p className="mt-2 mb-0 line-clamp-3">{title}</p>
                {!open && <TagButtons tags={tags} onClick={() => {}} />}
            </div>
            <div className="flex-col min-w-max ml-2">
                {bannerImgArea}
                {!open && (
                    <ActionButtons
                        onLike={onLike}
                        onCommentClick={onLike}
                        onShare={onLike}
                        likes={likes}
                        comments={comments}
                        isLiked={isLiked}
                    />
                )}
            </div>
        </Disclosure.Button>
    );
};

const FeedItemDisclosurePanel: FC<{
    description: string | undefined;
    link: string;
    tags: string[];
    likes: number;
    comments: number;
    isLiked: boolean;
    onLike: () => void;
    descriptionHeaderArea: JSX.Element | null;
}> = ({
    description,
    link,
    tags,
    likes,
    comments,
    isLiked,
    onLike,
    descriptionHeaderArea,
}) => {
    return (
        <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Disclosure.Panel className="pt-2 text-primaryVariant100  fontGroup-normal">
                {descriptionHeaderArea}
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
                    <div className="flex-col">
                        <TagButtons tags={tags} onClick={() => {}} />
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
            </Disclosure.Panel>
        </Transition>
    );
};

const NewsFeedItem: FC<{ item: INewsFeedItem }> = ({ item }) => {
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
    return (
        <FeedItemDisclosure>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton
                        open={open}
                        icon={feedIcons[type]}
                        date={computeDuration(date)}
                        title={title}
                        feedIconElement={
                            <FeedSourceInfo
                                name={source.name}
                                img={source.img}
                            />
                        }
                        bannerImgArea={<NewsCollpasedMedia img={img} />}
                        tags={tags}
                        onLike={() => {}}
                        likes={likes}
                        comments={comments}
                        isLiked={false}
                    />
                    <FeedItemDisclosurePanel
                        tags={tags}
                        onLike={() => {}}
                        likes={likes}
                        comments={comments}
                        description={description}
                        link={link}
                        isLiked={false}
                        descriptionHeaderArea={null}
                    />
                </>
            )}
        </FeedItemDisclosure>
    );
};

const VideoFeedItem: FC<{ item: IVideoFeedItem }> = ({ item }) => {
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
    const handlePlayVideo: MouseEventHandler<SVGSVGElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    return (
        <FeedItemDisclosure>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton
                        open={open}
                        icon={feedIcons[type]}
                        date={computeDuration(date)}
                        title={title}
                        feedIconElement={
                            <FeedSourceInfo
                                name={source.name}
                                img={source.img}
                            />
                        }
                        bannerImgArea={
                            open ? null : (
                                <VideoPlaceholder
                                    img={img}
                                    onPlayVideo={handlePlayVideo}
                                />
                            )
                        }
                        tags={tags}
                        onLike={() => {}}
                        likes={likes}
                        comments={comments}
                        isLiked={false}
                    />
                    <FeedItemDisclosurePanel
                        tags={tags}
                        onLike={() => {}}
                        likes={likes}
                        comments={comments}
                        description={description}
                        link={link}
                        isLiked={false}
                        descriptionHeaderArea={
                            <video
                                className="mb-2 rounded bg-backgroundVariant200"
                                onError={() => {}}
                            >
                                <source src={link} />
                                <track kind="captions" label="English" />
                            </video>
                        }
                    />
                </>
            )}
        </FeedItemDisclosure>

        //             <>
        //                 <Disclosure.Button
        //                     className={twMerge(
        //                         "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
        //                         open ? "" : "mb-2"
        //                     )}
        //                 >
        //                     <div className="flex-col">
        //                         <div className="flex items-center">
        //                             <img
        //                                 src={feedIcons[type]}
        //                                 alt="feed icon"
        //                                 className="w-8 h-8 mr-2"
        //                             />
        //                             <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
        //                                 {computeDuration(date)}
        //                                 <span className="mx-1.5 my-0 self-center">
        //                                     •
        //                                 </span>{" "}
        //                                 <span>
        //                                     <span className="capitalize">
        //                                         {source.name}
        //                                     </span>
        //                                     <img
        //                                         src={source.img}
        //                                         alt=""
        //                                         className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
        //                                         onError={imgOnError}
        //                                     />
        //                                 </span>
        //                             </p>
        //                         </div>
        //                         <p className="mt-2 mb-0 line-clamp-3">{title}</p>
        //                         {!open && (
        //                             <TagButtons
        //                                 tags={tags}
        //                                 onClick={() => {}}
        //                             />
        //                         )}
        //                     </div>
        //                     <div className="flex-col min-w-max ml-2">
        //                         <img
        //                             src={img}
        //                             alt=""
        //                             className="w-full h-24 rounded-lg object-cover"
        //                             onError={imgOnError}
        //                         />
        //                         {!open && (
        //                             <ActionButtons
        //                                 onLike={handleLike}
        //                                 onCommentClick={handleLike}
        //                                 onShare={handleLike}
        //                                 likes={likes}
        //                                 comments={comments}
        //                                 isLiked={isLiked}
        //                             />
        //                         )}
        //                     </div>
        //                 </Disclosure.Button>
        //                 <Transition
        //                     enter="transition duration-100 ease-out"
        //                     enterFrom="transform scale-95 opacity-0"
        //                     enterTo="transform scale-100 opacity-100"
        //                     leave="transition duration-75 ease-out"
        //                     leaveFrom="transform scale-100 opacity-100"
        //                     leaveTo="transform scale-95 opacity-0"
        //                 >
        //                     <Disclosure.Panel className="pt-2 text-primaryVariant100 line-clamp-4 fontGroup-normal">
        //                         <p className="m-0 text-primaryVariant100">
        //                             {description}
        //                         </p>
        //                         <a
        //                             href={link}
        //                             className="underline hover:underline fontGroup-supportBold mb-0 mt-0.5 leading-5 [text-underline-offset:_6px]"
        //                         >
        //                             Read more
        //                         </a>
        //                         <div className="my-2 flex justify-between">
        //                             <div className="flex-col">
        //                                 <TagButtons
        //                                     tags={tags}
        //                                     onClick={() => {}}
        //                                 />
        //                             </div>
        //                             <div className="flex-col min-w-max ml-2">
        //                                 <ActionButtons
        //                                     onLike={handleLike}
        //                                     onCommentClick={handleLike}
        //                                     onShare={handleLike}
        //                                     likes={likes}
        //                                     comments={comments}
        //                                     isLiked={isLiked}
        //                                 />
        //                             </div>
        //                         </div>
        //                     </Disclosure.Panel>
        //                 </Transition>
        //             </>
        //         )}
        //     </Disclosure>
        // </div>
    );
};

export const FeedCard: FC<{ item: IFeedItem }> = ({ item }) => {
    switch (item.type) {
        case EFeedItemType.NEWS:
            return <NewsFeedItem item={item} />;
        case EFeedItemType.VIDEO:
            return <VideoFeedItem item={item} />;
        case EFeedItemType.EVENTS:
            return <NewsFeedItem item={item as unknown as INewsFeedItem} />;
        default:
            return null;
    }
};
