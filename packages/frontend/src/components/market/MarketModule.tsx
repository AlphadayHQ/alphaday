import { FC } from "react";
import { ModuleLoader, Switch, twMerge } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import {
    TChartRange,
    TCoinMarketHistory,
    TCoin,
    TBaseEntity,
} from "src/api/types";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import globalMessages from "src/globalMessages";
import CandlestickChart from "./CandlestickChart";
import CoinInfo from "./CoinInfo";
import DateRangeBar from "./DateRangeBar";
import LineChart from "./LineChart";
import MarketsList from "./MarketsList";
import { EChartType, TMarketMeta } from "./types";

export interface IMarketModule {
    isLoading?: boolean;
    isLoadingHistory: boolean;
    isAuthenticated: boolean;
    availableMarkets: TMarketMeta[];
    selectedMarket: TCoin | undefined;
    onSelectMarket: (market: TMarketMeta) => void;
    selectedMarketHistory: TCoinMarketHistory | undefined;
    selectedChartRange: TChartRange;
    onSelectChartRange: (s: TChartRange) => void;
    selectedChartType: EChartType;
    onSelectChartType: (e: EChartType) => void;
    pinnedCoins: TCoin[];
    onTogglePin: (coin: TBaseEntity) => Promise<void>;
}

const FOOTER_WRAP_WIDTH = 510;

const MarketModule: FC<IMarketModule> = ({
    isLoading,
    isLoadingHistory,
    isAuthenticated,
    availableMarkets,
    selectedMarket,
    onSelectMarket,
    selectedMarketHistory,
    selectedChartRange,
    onSelectChartRange,
    selectedChartType,
    onSelectChartType,
    onTogglePin,
    pinnedCoins,
}) => {
    const {
        width,
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();

    const priceHistoryData = selectedMarketHistory?.history?.prices;

    if (isLoading) {
        return <ModuleLoader $height="600px" />;
    }

    let chartComponent;
    if (selectedMarket === undefined) {
        chartComponent = (
            <div className="flex items-center justify-center top-[220px] h-[200px] text-primaryVariant100">
                No coins with selected tags
            </div>
        );
    } else if (priceHistoryData === undefined && !isLoadingHistory) {
        chartComponent = (
            <div className="flex items-center justify-center top-[220px] h-[200px] text-primaryVariant100">
                {globalMessages.error.requestFailed(
                    `the ${selectedChartRange} history for this coin`
                )}
            </div>
        );
    } else {
        chartComponent =
            selectedChartType === EChartType.Line ? (
                <LineChart
                    selectedChartRange={selectedChartRange}
                    data={priceHistoryData ?? [[0], [1]]}
                    isLoading={isLoadingHistory}
                />
            ) : (
                <CandlestickChart
                    data={selectedMarketHistory?.ohlc ?? []}
                    isLoading={isLoadingHistory}
                />
            );
    }
    return (
        <div ref={squareRef} className="market-widget">
            <div className="p-0 flex items-center justify-between flex-wrap flex-1 basis-auto min-h-[1px]">
                <MarketsList
                    pinnedCoins={pinnedCoins}
                    markets={availableMarkets}
                    onSelectMarket={onSelectMarket}
                    setHeaderRef={setHeaderRef}
                    handleClickScroll={handleClickScroll}
                    hideLeftPan={hideLeftPan}
                    hideRightPan={hideRightPan}
                    selectedMarket={selectedMarket}
                />
                {selectedMarket && (
                    <div className="flex flex-col mt-3 pl-4 pr-4 w-full self-start single-col:mt-4 single-col:pl-[10px]">
                        <div className="flex items-start">
                            <div className="flex justify-between flex-1 ml-[5px]">
                                <CoinInfo
                                    selectedMarket={selectedMarket}
                                    isAuthenticated={isAuthenticated}
                                    onTogglePin={onTogglePin}
                                    isBookmarked={
                                        pinnedCoins.find(
                                            (c) => c.id === selectedMarket.id
                                        ) !== undefined
                                    }
                                />
                                <span className="switch">
                                    <Switch
                                        options={["Line", "Candlestick"]}
                                        checked={
                                            selectedChartType ===
                                            EChartType.Candlestick
                                        }
                                        onChange={() =>
                                            onSelectChartType(
                                                selectedChartType ===
                                                    EChartType.Candlestick
                                                    ? EChartType.Line
                                                    : EChartType.Candlestick
                                            )
                                        }
                                        disabled={
                                            selectedChartType ===
                                                EChartType.Line &&
                                            (selectedMarketHistory?.ohlc ===
                                                undefined ||
                                                selectedMarketHistory.ohlc
                                                    .length === 0)
                                        }
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full flex flex-col mt-[10px] two-col:mt-0">
                    <div className="pt-0 pb-[5px] px-5 w-full border-none single-col:flex single-col:justify-end single-col:items-center">
                        <DateRangeBar
                            selectedChartRange={selectedChartRange}
                            onSelectChartRange={onSelectChartRange}
                            selectedChartType={selectedChartType}
                        />
                    </div>
                    {chartComponent}
                </div>
                <div className="w-full flex py-0 px-4 flex-wrap">
                    <div
                        className={twMerge(
                            "flex justify-around",
                            width < FOOTER_WRAP_WIDTH ? "w-full" : "w-[50%]"
                        )}
                    >
                        <div className="flex flex-col items-start w-full max-w-[117px] min-w-[120px] my-4 mx-0 fontGroup-normal text-primary">
                            <span className="fontGroup-mini text-primaryVariant100">
                                Market Cap
                            </span>
                            <span className="value">
                                <span>
                                    {selectedMarket !== undefined
                                        ? formatNumber({
                                              value: selectedMarket.marketCap,
                                              style: ENumberStyle.Currency,
                                              currency: "USD",
                                          }).value
                                        : "-"}
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-col items-start w-full max-w-[117px] min-w-[120px] my-4 mx-0 fontGroup-normal text-primary">
                            <span className="fontGroup-mini text-primaryVariant100">
                                24 hours volume
                            </span>
                            <span className="value">
                                <span>
                                    {selectedMarket?.volume !== undefined
                                        ? formatNumber({
                                              value: selectedMarket.volume,
                                              style: ENumberStyle.Currency,
                                              currency: "USD",
                                          }).value
                                        : "-"}
                                </span>
                            </span>
                        </div>
                    </div>
                    {/* <div className="block">
                                <div className="column">
                                    <span className="label">
                                        24h Low / 24h High
                                    </span>
                                    <span className="value">
                                        <span>
                                            ${selectedChart?.low24 || 0} / $
                                            {selectedChart?.high24 || 0}
                                        </span>
                                    </span>
                                </div>
                                <div className="column">
                                    <span className="label">
                                        Volume / Market Cap
                                    </span>
                                    <span className="value">
                                        <span>
                                            {selectedChart?.volRatio || 0}
                                        </span>
                                    </span>
                                </div>
                            </div> */}
                </div>
            </div>
        </div>
    );
};

export default MarketModule;
