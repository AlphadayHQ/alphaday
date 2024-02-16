import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { imgOnError } from "src/utils/errorHandling";
import {
    ActionButtons,
    CardTitle,
    FeedItemDisclosure,
    FeedItemDisclosureButton,
    FeedItemDisclosureButtonImage,
    FeedItemDisclosurePanel,
    TagButtons,
    getFeedItemIcon,
} from "./FeedElements";
import LineChart from "./LineChart";

export const MarketCard: FC<{ item: TSuperfeedItem }> = ({ item }) => {
    const isTVL = item.type === EFeedItemType.TVL;

    const {
        tags,
        likes,
        comments,
        image,
        url,
        shortDescription,
        type,
        data: coinData,
    } = item;

    const onLike = () => {};
    const isLiked = false;

    const isDown = shortDescription?.includes("down");

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
                                            icon={getFeedItemIcon(type, isDown)}
                                        />
                                        <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            {isTVL ? (
                                                <span className="text-secondarySteelPink">
                                                    TVL Milestone
                                                </span>
                                            ) : (
                                                <span
                                                    className={twMerge(
                                                        isDown
                                                            ? "text-secondaryOrangeSoda"
                                                            : "text-success"
                                                    )}
                                                >
                                                    Price Alert
                                                </span>
                                            )}
                                            <span className="mx-1.5 my-0 self-center">
                                                •
                                            </span>{" "}
                                            <span>
                                                <span className="capitalize text-primary">
                                                    {coinData?.coin.name}
                                                </span>
                                                <img
                                                    src={image || undefined}
                                                    alt=""
                                                    className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
                                                    onError={imgOnError}
                                                />
                                            </span>
                                        </p>
                                    </div>
                                    <CardTitle title={shortDescription || ""} />
                                    <p className="fontGroup-highlight mt-1">
                                        Price:{" "}
                                        {coinData?.price &&
                                            formatNumber({
                                                value: coinData.price,
                                                style: ENumberStyle.Currency,
                                                currency: "USD",
                                            }).value}
                                    </p>
                                </div>
                                <div className="flex-col min-w-max mr-9">
                                    <div
                                        className={twMerge(
                                            "w-full flex justify-end items-start",
                                            open && "hidden"
                                        )}
                                    >
                                        <LineChart
                                            data={
                                                coinData?.history ?? [[0], [1]]
                                            }
                                            className="!h-20 !w-28"
                                            isPreview
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex-col">
                                    {!open && (
                                        <TagButtons
                                            truncated
                                            tags={tags}
                                            onClick={() => {}}
                                        />
                                    )}
                                </div>
                                <div className="flex-col min-w-max ml-2">
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
                            </div>
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <LineChart data={coinData?.history ?? [[0], [1]]} />
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:underline fontGroup-supportBold mb-0 pt-2 leading-5 [text-underline-offset:_6px]"
                        >
                            View Details
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
