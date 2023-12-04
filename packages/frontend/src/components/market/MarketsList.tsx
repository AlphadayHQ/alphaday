import React, { FC } from "react";
import { IconButton, TabButton } from "@alphaday/ui-kit";
import { TCoin } from "src/api/types";
import { TMarketMeta } from "./types";

interface IMarketsList {
    markets: TMarketMeta[] | undefined;
    setHeaderRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll: (scrollRight?: boolean) => void;
    hideLeftPan: boolean;
    hideRightPan: boolean;
    onSelectMarket: (market: TMarketMeta) => void;
    selectedMarket: TMarketMeta | undefined;
    pinnedCoins: TCoin[];
}
const MarketsList: FC<IMarketsList> = ({
    markets,
    setHeaderRef,
    handleClickScroll,
    hideLeftPan,
    hideRightPan,
    onSelectMarket,
    selectedMarket,
    pinnedCoins,
}) => {
    return (
        <div className="w-full border-b border-solid border-borderLine transition-[height] duration-[400ms] relative cursor-pointer">
            <div
                className="flex overflow-x-auto overflow-y-hidden px-0 py-[13px]"
                ref={(ref: HTMLDivElement | null) => ref && setHeaderRef(ref)}
            >
                <div className="min-w-[15px] h-5 self-center" />
                {!hideLeftPan && (
                    <span className="block absolute self-center left-[3px] top-[calc(50%_-_16.5px)]">
                        <IconButton
                            title="Pan Coins Left"
                            variant="leftArrow"
                            onClick={() => handleClickScroll()}
                        />
                    </span>
                )}
                {pinnedCoins.map((coin) => (
                    <span key={coin.slug} className="mr-1.5">
                        <TabButton
                            variant="small"
                            open={selectedMarket?.slug === coin.slug}
                            uppercase
                            onClick={() => onSelectMarket(coin)}
                        >
                            <img
                                className="w-[18px] h-[18px] mr-[5px] rounded-full"
                                src={coin.icon}
                                alt=""
                            />
                            {coin.ticker}
                        </TabButton>
                    </span>
                ))}
                {pinnedCoins.length > 0 && (
                    <div className="w-[2.5px] ml-1.5 mr-3 bg-btnRingVariant500 rounded-sm shrink-0" />
                )}
                {markets
                    ?.filter(
                        (market) =>
                            pinnedCoins.findIndex(
                                (coin) => coin.id === market.id
                            ) === -1
                    )
                    .map((market) => (
                        <span key={market.slug} className="mr-1.5">
                            <TabButton
                                variant="small"
                                open={selectedMarket?.slug === market.slug}
                                uppercase
                                onClick={() => onSelectMarket(market)}
                            >
                                <img
                                    className="w-[18px] h-[18px] mr-[5px] rounded-full"
                                    src={market.icon}
                                    alt=""
                                />
                                {market.ticker}
                            </TabButton>
                        </span>
                    ))}
                <div className="min-w-[15px] h-5 self-center" />
                {!hideRightPan && (
                    <span className="block absolute self-center left-auto top-[calc(50%_-_16.5px)] right-[3px]">
                        <IconButton
                            title="Pan Coins Right"
                            variant="rightArrow"
                            onClick={() => handleClickScroll(true)}
                        />
                    </span>
                )}
            </div>
        </div>
    );
};

export default MarketsList;
