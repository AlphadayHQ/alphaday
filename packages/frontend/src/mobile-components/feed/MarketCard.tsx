import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { TSuperfeedItem } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { computeDuration } from "src/utils/dateUtils";
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

const parseHistory = (
    history: string | [number, number][]
): [number, number][] => {
    if (typeof history === "string") {
        const parsedHistory = JSON.parse(history);
        if (!Array.isArray(parsedHistory)) {
            return [[0, 1]];
        }
        return parsedHistory;
    }
    return history;
};

export const MarketCard: FC<{
    item: TSuperfeedItem;
    isAuthenticated: boolean;
    onLike: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
    onClick: () => MaybeAsync<void>;
}> = ({ item, onLike, onShare, onClick, isAuthenticated }) => {
    const {
        tags,
        likes,
        comments,
        image,
        url,
        shortDescription,
        type,
        date,
        data: coinData,
    } = item;

    const isDown = shortDescription?.includes("down");
    const isATH = coinData?.interval === "ATH";

    return (
        <FeedItemDisclosure onClick={onClick}>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FeedItemDisclosureButtonImage
                                            icon={getFeedItemIcon(type, isDown)}
                                        />
                                        <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            {computeDuration(date)}
                                            <span className="mx-1 my-0 self-center">
                                                •
                                            </span>{" "}
                                            <span>
                                                <span className="capitalize text-primary">
                                                    {coinData?.coin?.name}
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
                                    {!isATH && (
                                        <p className="fontGroup-highlight mt-1">
                                            Price:{" "}
                                            {coinData?.price &&
                                                formatNumber({
                                                    value: coinData.price,
                                                    style: ENumberStyle.Currency,
                                                    currency: "USD",
                                                }).value}
                                        </p>
                                    )}
                                </div>
                                <div
                                    className={twMerge(
                                        "flex-col min-w-max mr-9",
                                        isATH &&
                                            "mr-0 p-4 pr-0 rounded-md items-center justify-center",
                                        isATH && !open && "h-20 w-28"
                                    )}
                                >
                                    <div
                                        className={twMerge(
                                            "w-full flex justify-end items-start",
                                            open && "hidden"
                                        )}
                                    >
                                        {isATH ? (
                                            <p className="text-success text-4xl font-semibold">
                                                {coinData?.price &&
                                                    formatNumber({
                                                        value: coinData.price,
                                                        style: ENumberStyle.Currency,
                                                        currency: "USD",
                                                    }).value}
                                            </p>
                                        ) : (
                                            <LineChart
                                                data={
                                                    coinData?.history
                                                        ? parseHistory(
                                                              coinData.history
                                                          )
                                                        : [[0, 1]]
                                                }
                                                className="!h-20 !w-28"
                                                isPreview
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <LineChart
                            data={
                                coinData?.history
                                    ? parseHistory(coinData.history)
                                    : [[0, 1]]
                            }
                        />
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:underline fontGroup-supportBold mb-0 pt-2 leading-5 [text-underline-offset:_6px]"
                        >
                            View Details
                        </a>
                    </FeedItemDisclosurePanel>
                    <div className="flex justify-between my-2">
                        <div className="flex-col">
                            <TagButtons truncated tags={tags} />
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
