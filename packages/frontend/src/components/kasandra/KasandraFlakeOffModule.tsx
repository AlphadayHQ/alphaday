import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import type {
    TChartRange,
    TCoin,
    TCoinMarketHistory,
    TFlakeOffData,
    TKasandraCase,
} from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import CoinInfo from "../market/CoinInfo";
import DateRangeBar from "../market/DateRangeBar";
import MarketsList from "../market/MarketsList";
import { EChartType, TMarketMeta } from "../market/types";
import { CaseSelect } from "./CaseSelect";
import Disclaimer from "./Disclaimer";
import FlakeOffChart from "./FlakeOffChart";

export interface IKasandraModule {
    isLoading?: boolean;
    flakeOffData: TFlakeOffData | undefined;
    selectedMarketHistory: TCoinMarketHistory | undefined;
    selectedChartRange: TChartRange;
    onSelectChartRange: (s: TChartRange) => void;
    selectedCase: TKasandraCase;
    onSelectCase: (kase: TKasandraCase) => void;
    selectedMarket: TCoin | undefined;
    isAuthenticated: boolean;
    supportedCoins: TCoin[];
    onSelectMarket: (market: TMarketMeta) => void;
    contentHeight: string;
    disclaimerAccepted: boolean;
    onAcceptDisclaimer: () => void;
}

const KasandraModule: FC<IKasandraModule> = ({
    isLoading,
    flakeOffData,
    selectedMarketHistory,
    selectedChartRange,
    onSelectChartRange,
    selectedCase,
    onSelectCase,
    selectedMarket,
    isAuthenticated,
    supportedCoins,
    onSelectMarket,
    contentHeight,
    disclaimerAccepted,
    onAcceptDisclaimer,
}) => {
    const { t } = useTranslation();
    const {
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();

    if (isLoading) {
        return <ModuleLoader $height={contentHeight} />;
    }

    return (
        <div ref={squareRef} className="kasandra-widget">
            <div className="p-0 flex items-center justify-between flex-wrap flex-1 basis-auto min-h-[1px]">
                <div className="w-full flex flex-col mt-[10px] two-col:mt-0">
                    <MarketsList
                        pinnedCoins={supportedCoins}
                        onSelectMarket={onSelectMarket}
                        setHeaderRef={setHeaderRef}
                        handleClickScroll={handleClickScroll}
                        hideLeftPan={hideLeftPan}
                        hideRightPan={hideRightPan}
                        selectedMarket={selectedMarket}
                    />
                    <div className="-mt-2">
                        <Disclaimer
                            onAccept={onAcceptDisclaimer}
                            accepted={disclaimerAccepted}
                        />
                    </div>
                    <div className="flex justify-between">
                        {selectedMarket && (
                            <div className="flex flex-col mt-3 pl-4 pr-4 w-full self-start single-col:mt-4 single-col:pl-[10px]">
                                <div className="flex items-start">
                                    <div className="flex justify-between flex-1 ml-[5px]">
                                        <CoinInfo
                                            selectedMarket={selectedMarket}
                                            isAuthenticated={isAuthenticated}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 pb-10 px-5 w-full border-none flex flex-col justify-end items-center two-col:flex-row">
                            <DateRangeBar
                                selectedChartRange={selectedChartRange}
                                onSelectChartRange={onSelectChartRange}
                                selectedChartType={EChartType.Line}
                                isKasandra
                            />
                            <div className="w-56 ml-2 -mr-4 [&>.coin-select-indicator]:pr-0 flex justify-end">
                                <CaseSelect
                                    selectedCase={selectedCase}
                                    onSelect={onSelectCase}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <LineChart
                        selectedChartRange={selectedChartRange}
                        historyData={priceHistoryData ?? [[0], [1]]}
                        predictionData={predictionData}
                        insightsData={insightsData}
                        isLoading={isLoadingHistory || isLoadingPredictions}
                        selectedTimestamp={selectedTimestamp}
                        onSelectDataPoint={onSelectDataPoint}
                        selectedCase={selectedCase?.id}
                    /> */}
                    <FlakeOffChart
                        flakeOffData={flakeOffData}
                        marketHistory={selectedMarketHistory}
                        selectedCase={selectedCase?.id}
                    />
                </div>
                <div className="w-full flex py-0 px-4 flex-wrap">
                    <div className="flex justify-around w-full">
                        <div className="flex flex-col items-start w-full max-w-[117px] min-w-[120px] my-4 mx-0 fontGroup-normal text-primary">
                            <span className="fontGroup-mini text-primaryVariant100">
                                {t("market.marketCap")}
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
                                {t("market.volume24h")}
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

export default KasandraModule;
