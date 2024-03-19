import { FC } from "react";
import { TSuperfeedItem } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { computeDuration } from "src/utils/dateUtils";
import {
    ActionButtons,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    FeedSourceInfo,
    TagButtons,
    getFeedItemIcon,
} from "./FeedElements";

export const TVLCard: FC<{
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
        type,
        shortDescription,
        date,
        data,
    } = item;

    const projectsNameList = data?.projects
        ?.map((project) => project.name)
        .join(", ");

    const combinedTVL = data?.projects?.reduce((acc, project) => {
        return acc + project.tvl;
    }, 0);

    return (
        <FeedItemDisclosure>
            {({ open }) => (
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
                                    {projectsNameList &&
                                        `: ${projectsNameList}`}
                                </p>

                                {combinedTVL && (
                                    <p className="mt-2">
                                        Combined TVL{" "}
                                        <span className="text-success">
                                            {
                                                formatNumber({
                                                    value: combinedTVL,
                                                    style: ENumberStyle.Currency,
                                                    currency: "USD",
                                                }).value
                                            }
                                        </span>{" "}
                                    </p>
                                )}
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
                                            onShare={onShare}
                                            likes={likes}
                                            comments={comments}
                                            isAuthenticated={isAuthenticated}
                                            isLiked={item.isLiked}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <p className="m-0 text-primaryVariant100 line-clamp-4">
                            {shortDescription}
                        </p>
                        <div className="my-2 flex justify-between">
                            <TagButtons tags={tags} onClick={() => {}} />
                            <div className="min-w-max ml-2 mt-0.5">
                                <ActionButtons
                                    onLike={onLike}
                                    onCommentClick={onLike}
                                    onShare={onShare}
                                    likes={likes}
                                    comments={comments}
                                    isAuthenticated={isAuthenticated}
                                    isLiked={item.isLiked}
                                />
                            </div>
                        </div>
                    </FeedItemDisclosurePanel>
                </>
            )}
        </FeedItemDisclosure>
    );
};
