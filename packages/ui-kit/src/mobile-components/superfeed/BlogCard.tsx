import { FC } from "react";
import { computeDuration } from "src/utils/dateUtils";
import {
    ActionButtons,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    FeedSourceInfo,
    TagButtons,
} from "./FeedElements";
import {
    IBlogFeedItem,
    IForumFeedItem,
    IPersonFeedItem,
    feedIcons,
} from "./types";

export const BlogCard: FC<{
    item: IBlogFeedItem | IForumFeedItem | IPersonFeedItem;
}> = ({ item }) => {
    const {
        title,
        date,
        tags,
        likes,
        comments,
        link,
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
                                <p className="mt-2 mb-0 fontGroup-highlight line-clamp-3">
                                    {title}
                                </p>
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
