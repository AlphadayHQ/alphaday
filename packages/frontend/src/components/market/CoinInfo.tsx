import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { TBaseEntity, TCoin } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import ItemBookmark from "src/components/listItem/ItemBookmark";

const CoinInfo: FC<{
    selectedMarket: TCoin;
    isAuthenticated: boolean;
    onTogglePin: (coin: TBaseEntity) => Promise<void>;
    isBookmarked: boolean;
}> = ({ selectedMarket, isAuthenticated, onTogglePin, isBookmarked }) => (
    <div className="data-wrap">
        <div className="flex fontGroup-normal mb-2 [&>*]:mr-1.5 [&>.bookmark]:flex items-center [&>.bookmark]:cursor-pointer">
            {selectedMarket.icon && (
                <img
                    src={selectedMarket.icon}
                    alt=""
                    className="w-[18px] rounded-full"
                />
            )}
            <span className="text-primary capitalize fontGroup-highlightSemi">
                {selectedMarket.name}
            </span>
            <span className="text-primaryVariant100 fontGroup-highlightSemi">
                {selectedMarket.ticker.toUpperCase()}
            </span>
            <ItemBookmark
                isAuthenticated={isAuthenticated}
                onBookmark={async () => {
                    await onTogglePin(selectedMarket);
                }}
                bookmarked={isBookmarked}
                showSpacer={false}
                className="self-center"
            />
        </div>
        {selectedMarket && (
            <div className="flex flex-nowrap single-col:flex-wrap mb-[5px]">
                <h2 className="mb-0 text-primary fontGroup-major">
                    {
                        formatNumber({
                            value: selectedMarket.price,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </h2>
                <h6
                    className={twMerge(
                        "fontGroup-support ml-[5px] mb-0 pt-[3px] self-start tiny:flex tiny:flex-nowrap tiny:whitespace-nowrap tiny:self-end",
                        selectedMarket.percentChange24h < 0
                            ? "text-secondaryOrangeSoda"
                            : "text-success"
                    )}
                >
                    {
                        formatNumber({
                            value: selectedMarket.percentChange24h,
                            style: ENumberStyle.Percent,
                            normalise: true,
                        }).value
                    }
                    <span className="lowercase text-primaryVariant100">
                        / 24h
                    </span>
                </h6>
            </div>
        )}
    </div>
);

export default CoinInfo;
