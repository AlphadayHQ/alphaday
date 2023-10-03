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
import ItemBookmark from "src/components/listItem/ItemBookmark";
import globalMessages from "src/globalMessages";
import CandlestickChart from "./CandlestickChart";
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
        <div ref={squareRef}>
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
                    <div className="flex flex-col mt-[11px] pl-[15px] pr-[15px] w-full self-start single-col:mt-5 single-col:pl-[10px]">
                        <div className="flex items-start">
                            <div className="flex justify-between flex-1 ml-[5px]">
                                <div className="data-wrap">
                                    <div className="flex fontGroup-normal mb-2 [&>*]:mr-1.5 [&>.bookmark]:flex [&>.bookmark]:items-center [&>.bookmark]:cursor-pointer">
                                        {selectedMarket.icon && (
                                            <img
                                                src={selectedMarket.icon}
                                                alt=""
                                                className="w-[18px]"
                                            />
                                        )}
                                        <span className="text-primary capitalize fontGroup-highlightSemi">
                                            {selectedMarket.name}
                                        </span>
                                        <span className="text-primaryVariant100 fontGroup-highlight">
                                            {selectedMarket.ticker.toUpperCase()}
                                        </span>
                                        <ItemBookmark
                                            isAuthenticated={isAuthenticated}
                                            onBookmark={async () => {
                                                await onTogglePin(
                                                    selectedMarket
                                                );
                                            }}
                                            bookmarked={
                                                pinnedCoins.find(
                                                    (c) =>
                                                        c.id ===
                                                        selectedMarket.id
                                                ) !== undefined
                                            }
                                            showSpacer={false}
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
                                                    selectedMarket.percentChange24h <
                                                        0
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

                <div className="w-full flex flex-col mt-[10px] single-col:flex-row two-col:mt-0">
                    <div className="pt-0 pb-[5px] w-full border-none single-col:flex single-col:justify-end single-col:items-center">
                        <DateRangeBar
                            selectedChartRange={selectedChartRange}
                            onSelectChartRange={onSelectChartRange}
                            selectedChartType={selectedChartType}
                        />
                    </div>
                    {chartComponent}
                </div>
                <div className="w-full flex py-0 px-[15px] flex-wrap">
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
                        <div className="column">
                            <span className="label">24 hours volume</span>
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
