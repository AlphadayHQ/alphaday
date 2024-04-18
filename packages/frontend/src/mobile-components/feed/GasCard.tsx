import { FC } from "react";
import { Arrow, twMerge } from "@alphaday/ui-kit";
import { TSuperfeedItem } from "src/api/types";
import GasPriceBox from "src/components/gas/GasPriceBox";
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

export const GasCard: FC<{
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
        title,
        type,
        date,
        sourceIcon,
        data: gasData,
    } = item;

    const isDown = gasData?.gasPercentChange && gasData.gasPercentChange < 0;

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
                                            icon={getFeedItemIcon(type)}
                                        />
                                        <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                                            {computeDuration(date)}
                                            <span className="mx-1 my-0 self-center">
                                                •
                                            </span>{" "}
                                            <span>
                                                <img
                                                    src={sourceIcon}
                                                    alt=""
                                                    className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
                                                    onError={imgOnError}
                                                />
                                            </span>
                                        </p>
                                    </div>
                                    <CardTitle title={title || ""} />
                                    <p className="mt-4">
                                        Gas Fees are {isDown ? "down" : "up"}{" "}
                                        {isDown ? (
                                            <Arrow
                                                className="h-2.5"
                                                direction="down"
                                            />
                                        ) : (
                                            <Arrow
                                                className="h-2.5"
                                                direction="up"
                                            />
                                        )}{" "}
                                        {gasData?.gasPercentChange}%
                                    </p>
                                </div>
                                <div className="flex-col min-w-max mr-9">
                                    <div
                                        className={twMerge(
                                            "w-full flex justify-end items-start",
                                            open && "hidden"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </FeedItemDisclosureButton>
                    <FeedItemDisclosurePanel>
                        <div className="my-2 flex justify-between max-w-sm mx-auto">
                            <GasPriceBox
                                type="slow"
                                gweiPrice={gasData?.gasSlow}
                                usdPrice={undefined}
                                isCard
                            />
                            <GasPriceBox
                                type="standard"
                                gweiPrice={gasData?.gasStandard}
                                usdPrice={undefined}
                                isCard
                            />
                            <GasPriceBox
                                type="fast"
                                gweiPrice={gasData?.gasFast}
                                usdPrice={undefined}
                                isCard
                            />
                        </div>
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
