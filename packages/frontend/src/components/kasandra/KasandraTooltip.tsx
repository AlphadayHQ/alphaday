import moment from "moment";
import { EPredictionCase } from "src/api/types";
import { formatNumber, ENumberStyle } from "src/api/utils/format";

export type TCustomTooltip = {
    series: number[][];
    seriesIndex: number;
    dataPointIndex: number;
    selectedCase: EPredictionCase | "all" | undefined;
    dataset: {
        name: string;
        data: number[][];
    }[];
};

const KasandraTooltip = ({
    series,
    seriesIndex,
    dataPointIndex,
    dataset,
    selectedCase,
}: TCustomTooltip) => {
    const isPredictions = seriesIndex !== 0;
    const isOptimistic = selectedCase === EPredictionCase.OPTIMISTIC;
    const isBaseline = selectedCase === EPredictionCase.BASELINE;
    const isPessimistic = selectedCase === EPredictionCase.PESSIMISTIC;
    const isAll = selectedCase === "all" || selectedCase === undefined;

    const bullishIndex = 1;
    const baseIndex = isBaseline ? 1 : 2;
    const bearishIndex = isPessimistic ? 1 : 3;

    const seriesNameMap = {
        0: "Price",
        1: "Bullish",
        2: "Neutral",
        3: "Bearish",
    };

    return (
        <div className="px-2.5 py-2 flex flex-col break-word rounded-[5px] bg-backgroundVariant100 border-[0.5px] border-borderLine fontGroup-support text-primary">
            {isPredictions ? (
                <div>
                    {(isOptimistic || isAll) && (
                        <div className="mb-2 flex justify-between w-full">
                            <div className="text-white capitalize fontGroup-support !font-semibold inline">
                                <div className="inline-flex mr-1.5 mb-0.5 self-start bg-success w-1 h-1 rounded-full" />
                                {seriesNameMap[1]}: {}
                            </div>
                            <div className="inline ml-1">
                                {
                                    formatNumber({
                                        value: series[bullishIndex][
                                            dataPointIndex
                                        ],
                                        style: ENumberStyle.Currency,
                                        currency: "USD",
                                    }).value
                                }
                            </div>
                        </div>
                    )}
                    {(isBaseline || isAll) && (
                        <div className="mb-2 flex justify-between w-full">
                            <div className="text-white capitalize fontGroup-support !font-semibold inline">
                                <div className="inline-flex mr-1.5 mb-0.5 self-start bg-secondaryYellowGreen w-1 h-1 rounded-full" />
                                {seriesNameMap[2]}: {}
                            </div>
                            <div className="inline ml-1">
                                {
                                    formatNumber({
                                        value: series[baseIndex][
                                            dataPointIndex
                                        ],
                                        style: ENumberStyle.Currency,
                                        currency: "USD",
                                    }).value
                                }
                            </div>
                        </div>
                    )}
                    {(isPessimistic || isAll) && (
                        <div className="mb-2 flex justify-between w-full">
                            <div className="text-white capitalize fontGroup-support !font-semibold inline">
                                <div className="inline-flex mr-1.5 mb-0.5 self-start bg-secondaryOrangeSoda w-1 h-1 rounded-full" />
                                {seriesNameMap[3]}: {}
                            </div>
                            <div className="inline ml-1">
                                {
                                    formatNumber({
                                        value: series[bearishIndex][
                                            dataPointIndex
                                        ],
                                        style: ENumberStyle.Currency,
                                        currency: "USD",
                                    }).value
                                }
                            </div>
                        </div>
                    )}
                    <span className="fontGroup-support ">
                        {moment(
                            dataset[seriesIndex].data[dataPointIndex][0]
                        ).format("YYYY-MM-DD")}
                    </span>
                    <span className="ml-7 fontGroup-support ">
                        {moment(
                            dataset[seriesIndex].data[dataPointIndex][0]
                        ).format("HH:mm")}
                    </span>
                </div>
            ) : (
                <div>
                    <div className="mb-2 flex justify-between w-full">
                        <div className="text-white capitalize fontGroup-support !font-semibold inline">
                            {seriesNameMap[0]}: {}
                        </div>
                        <div className="inline ml-1">
                            {
                                formatNumber({
                                    value: series[seriesIndex][dataPointIndex],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </div>
                    </div>
                    <span className="fontGroup-support ">
                        {moment(
                            dataset[seriesIndex].data[dataPointIndex][0]
                        ).format("YYYY-MM-DD")}
                    </span>
                    <span className="ml-4 fontGroup-support ">
                        {moment(
                            dataset[seriesIndex].data[dataPointIndex][0]
                        ).format("HH:mm")}
                    </span>
                </div>
            )}
        </div>
    );
};

export default KasandraTooltip;
