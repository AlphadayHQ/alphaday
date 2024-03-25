import { FC } from "react";
import { TSuperfeedItem } from "src/api/types";
import { computeDuration } from "src/utils/dateUtils";
import {
    ActionButtons,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    FeedSourceInfo,
    ReadMoreLink,
    TagButtons,
    getFeedItemIcon,
} from "./FeedElements";

export const BlogCard: FC<{
    item: TSuperfeedItem;
    isAuthenticated: boolean;
    onLike: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
}> = ({ item, onLike, onShare, isAuthenticated }) => {
    const {
        title,
        tags,
        likes,
        comments,
        sourceIcon,
        sourceName,
        url,
        type,
        shortDescription,
        date,
    } = item;

    return (
        <FeedItemDisclosure>
            {() => (
                <>
                    <FeedItemDisclosureButton>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <FeedItemDisclosureButtonImage
                                        icon={getFeedItemIcon(type)}
                                    />
                                    <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                        <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            {computeDuration(date)}
                                            <span className="mx-1 my-0 self-center">
                                                •
                                            </span>{" "}
                                            <FeedSourceInfo
                                                name={sourceName}
                                                img={sourceIcon}
                                            />{" "}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-2 mb-0 fontGroup-highlight line-clamp-3">
                                    {title}
                                </p>
                            </div>
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <p className="m-0 text-primaryVariant100 line-clamp-4">
                            {shortDescription}
                        </p>
                        <ReadMoreLink url={url} />
                    </FeedItemDisclosurePanel>
                    <div className="flex justify-between my-2">
                        <div className="flex-col">
                            <TagButtons
                                truncated
                                tags={tags}
                                onClick={() => {}}
                            />
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
