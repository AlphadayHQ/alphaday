import { FC, useEffect, useState } from "react";
import { ModuleLoader, twMerge } from "@alphaday/ui-kit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import {
    TBaseEntity,
    TChartRange,
    TCoin,
    TCoinMarketHistory,
    TPredictions,
} from "src/api/types";
// import { formatNumber, ENumberStyle } from "src/api/utils/format";
import CoinInfo from "../market/CoinInfo";
import DateRangeBar from "../market/DateRangeBar";
import MarketsList from "../market/MarketsList";
import { EChartType, TMarketMeta } from "../market/types";
import LineChart from "./LineChart";

// check if prediction date is today or in the future
const isPredictionDateInFuture = (predictionDate: number) => {
    const predictionDateMoment = moment(predictionDate);
    return predictionDateMoment.isAfter(moment());
};

export interface IMarketModule {
    isLoading?: boolean;
    isLoadingHistory: boolean;
    isLoadingPredictions: boolean;
    selectedMarketHistory: TCoinMarketHistory | undefined;
    selectedPredictions: TPredictions | undefined;
    selectedChartRange: TChartRange;
    onSelectChartRange: (s: TChartRange) => void;
    selectedMarket: TCoin | undefined;
    isAuthenticated: boolean;
    onTogglePin: (coin: TBaseEntity) => Promise<void>;
    pinnedCoins: TCoin[];
    availableMarkets: TMarketMeta[];
    onSelectMarket: (market: TMarketMeta) => void;
    contentHeight: string;
    selectedDataPoint: [number, number] | undefined;
    onSelectDataPoint: (dataPoint: [number, number]) => void;
}

const MarketModule: FC<IMarketModule> = ({
    isLoading,
    isLoadingHistory,
    isLoadingPredictions,
    selectedMarketHistory,
    selectedPredictions,
    selectedChartRange,
    onSelectChartRange,
    selectedMarket,
    isAuthenticated,
    onTogglePin,
    pinnedCoins,
    availableMarkets,
    onSelectMarket,
    contentHeight,
    selectedDataPoint,
    onSelectDataPoint,
}) => {
    const { t } = useTranslation();
    const {
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();
    const priceHistoryData = selectedMarketHistory?.history?.prices;

    // console.log("selectedPredictions => Data", selectedPredictions);

    const [predictionData, setPredictionData] = useState<{
        bullish: [number, number][];
        bearish: [number, number][];
        base: [number, number][];
    }>({ bullish: [], bearish: [], base: [] });

    useEffect(() => {
        const bullishPredictions: [number, number][] = [];
        const bearishPredictions: [number, number][] = [];
        const basePredictions: [number, number][] = [];

        if (selectedPredictions) {
            Object.entries(selectedPredictions).forEach(
                ([predictionCase, prediction]) => {
                    prediction.data.forEach((p) => {
                        if (isPredictionDateInFuture(p.timestamp)) {
                            if (predictionCase === "optimistic") {
                                bullishPredictions.push([p.timestamp, p.price]);
                            } else if (predictionCase === "pessimistic") {
                                bearishPredictions.push([p.timestamp, p.price]);
                            } else {
                                basePredictions.push([p.timestamp, p.price]);
                            }
                        }
                    });
                }
            );
        }
        setPredictionData({
            bullish: bullishPredictions,
            bearish: bearishPredictions,
            base: basePredictions,
        });
    }, [selectedPredictions]);

    if (isLoading) {
        return <ModuleLoader $height={contentHeight} />;
    }

    return (
        <div ref={squareRef} className="market-widget">
            <div className="p-0 flex items-center justify-between flex-wrap flex-1 basis-auto min-h-[1px]">
                <div className="w-full flex flex-col mt-[10px] two-col:mt-0">
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
                                                (c) =>
                                                    c.id === selectedMarket.id
                                            ) !== undefined
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-0 pb-[5px] px-5 w-full border-none single-col:flex single-col:justify-end single-col:items-center">
                        <DateRangeBar
                            selectedChartRange={selectedChartRange}
                            onSelectChartRange={onSelectChartRange}
                            selectedChartType={EChartType.Line}
                        />
                    </div>
                    <LineChart
                        selectedChartRange={selectedChartRange}
                        historyData={priceHistoryData ?? [[0], [1]]}
                        predictionData={predictionData}
                        isLoading={isLoadingHistory || isLoadingPredictions}
                        selectedDataPoint={selectedDataPoint}
                        onSelectDataPoint={onSelectDataPoint}
                    />
                </div>
                <div className="w-full flex py-0 px-4 flex-wrap">
                    <div className={twMerge("flex justify-around w-[50%]")}>
                        <div className="flex flex-col items-start w-full max-w-[117px] min-w-[120px] my-4 mx-0 fontGroup-normal text-primary">
                            <span className="fontGroup-mini text-primaryVariant100">
                                {t("market.marketCap")}
                            </span>
                            <span className="value">
                                <span>
                                    {/* {selectedMarket !== undefined
                                        ? formatNumber({
                                              value: selectedMarket.marketCap,
                                              style: ENumberStyle.Currency,
                                              currency: "USD",
                                          }).value
                                        : "-"} */}
                                    $1.7T
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-col items-start w-full max-w-[117px] min-w-[120px] my-4 mx-0 fontGroup-normal text-primary">
                            <span className="fontGroup-mini text-primaryVariant100">
                                {t("market.volume24h")}
                            </span>
                            <span className="value">
                                <span>
                                    {/* {selectedMarket?.volume !== undefined
                                        ? formatNumber({
                                              value: selectedMarket.volume,
                                              style: ENumberStyle.Currency,
                                              currency: "USD",
                                          }).value
                                        : "-"} */}
                                    $2.51B
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketModule;
