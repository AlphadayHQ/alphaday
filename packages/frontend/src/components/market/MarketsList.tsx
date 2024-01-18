import React, { FC } from "react";
import { TabsBar } from "@alphaday/ui-kit";
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
    const pinnedCoinTabs = [
        ...pinnedCoins.map((coin) => ({
            label: coin.ticker,
            value: coin.id.toString(),
            icon: coin.icon,
        })),
    ];
    const unpinnedCoinTabs = markets
        ?.filter(
            (market) =>
                pinnedCoins.findIndex((coin) => coin.id === market.id) === -1
        )
        .map((market) => ({
            label: market.ticker,
            value: market.id.toString(),
            icon: market.icon,
        }));
    const coinTabs = [...pinnedCoinTabs, ...(unpinnedCoinTabs || [])];
    const selectedTab =
        pinnedCoins.find((coin) => coin.id === selectedMarket?.id) ||
        pinnedCoins[0];

    const handleTabChange = (value: string) => {
        const coin = markets?.find((market) => market.id.toString() === value);
        if (coin) onSelectMarket(coin);
    };

    return (
        <div className="w-full transition-[height] duration-[400ms] relative cursor-pointer">
            <div className="flex mx-2 overflow-x-auto overflow-y-hidden px-0 pb-2">
                <TabsBar
                    options={coinTabs}
                    onChange={handleTabChange}
                    selectedOption={{
                        label: selectedTab?.ticker,
                        value: selectedTab?.id.toString(),
                    }}
                    setHeaderRef={setHeaderRef}
                    handleClickScroll={handleClickScroll}
                    hideLeftPan={hideLeftPan}
                    hideRightPan={hideRightPan}
                />
                {pinnedCoins.length > 0 && (
                    <div className="w-[2.5px] ml-1.5 mr-3 bg-borderLine rounded-sm shrink-0" />
                )}
                <div className="min-w-4 h-5 self-center" />
            </div>
        </div>
    );
};

export default MarketsList;
