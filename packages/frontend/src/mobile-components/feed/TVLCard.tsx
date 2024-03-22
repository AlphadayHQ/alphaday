import { FC } from "react";
import logoDay from "@alphaday/ui-kit/src/assets/svg/logo-white.svg";
import { TSuperfeedItem, TTVLFeedDataItem } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import {
    PROJECTS_LOGO_KEYS,
    PROJECTS_LOGO_MAPPING,
} from "src/components/tvl/common";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
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

const TVLItem: FC<{ projectData: TTVLFeedDataItem; index: number }> = ({
    projectData,
    index,
}) => {
    return (
        <div
            className="flex flex-row flex-[1_auto] py-[10px] pr-4 pl-1"
            role="button"
            tabIndex={0}
        >
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: 1,
                }}
            >
                <div className="flex flex-row justify-start flex-1 items-center text-primary fontGroup-supportBold">
                    {index + 1}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: 6,
                }}
            >
                <div className="flex flex-row flex-[0_1_auto] h-[21px] w-[21px] relative overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-background" />
                    <img
                        src={
                            projectData.icon ??
                            PROJECTS_LOGO_MAPPING[
                                PROJECTS_LOGO_KEYS.find(
                                    (e) => e === projectData.name
                                ) || "Unknown"
                            ]
                        }
                        onError={imgOnError}
                        alt=""
                        className="absolute inset-0 bg-background rounded-full"
                        style={{
                            backgroundImage: `url(${logoDay})`,
                        }}
                    />
                </div>
                <div className="text-primary fontGroup-highlightSemi ml-1.5">
                    {projectData.name}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: 2,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end text-primary">
                    {
                        formatNumber({
                            value: projectData.tvl,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </div>
            </div>
        </div>
    );
};

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
                        {data?.projects?.map((project, i) => (
                            <TVLItem projectData={project} index={i} />
                        ))}

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
