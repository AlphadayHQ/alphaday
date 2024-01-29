import { FC } from "react";
import { computeDuration } from "src/utils/dateUtils";
import { twMerge } from "tailwind-merge";
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
import LineChart from "./LineChart";
import {
    EFeedItemType,
    IPriceFeedItem,
    ITVLFeedItem,
    feedIcons,
} from "./types";

export const PriceCard: FC<{ item: IPriceFeedItem | ITVLFeedItem }> = ({
    item,
}) => {
    const isTVL = item.type === EFeedItemType.TVL;
    const price = isTVL ? item.tvl : item.price;
    const { change, tags, likes, comments, link, history, coin, date } = item;

    const onLike = () => {};
    const isLiked = false;

    const isDown = change < 0;
    const icon = isTVL ? feedIcons.tvl : feedIcons.price(isDown);

    const title = `${coin.name} price is ${isDown ? "down" : "up"} ${change}%`;

    return (
        <FeedItemDisclosure>
            {({ open }) => (
                <>
                    <FeedItemDisclosureButton open={open}>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FeedItemDisclosureButtonImage
                                            icon={icon}
                                        />
                                        <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                                {isTVL ? (
                                                    <span className="text-secondarySteelPink">
                                                        TVL Milestone
                                                    </span>
                                                ) : (
                                                    <span className="text-success">
                                                        Price Alert
                                                    </span>
                                                )}
                                                <span className="mx-1.5 my-0 self-center">
                                                    •
                                                </span>{" "}
                                                <FeedSourceInfo
                                                    name={coin.name}
                                                    img={coin.img}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <CardTitle title={title} />
                                    <p className="fontGroup-highlight">
                                        ${price}
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
                                            data={history}
                                            isLoading={false}
                                            className="!h-20 !w-28"
                                            isPreview
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex-col">
                                    {!open && (
                                        <TagButtons
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
                        <LineChart data={history} isLoading={false} />
                        <a
                            href={link}
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
