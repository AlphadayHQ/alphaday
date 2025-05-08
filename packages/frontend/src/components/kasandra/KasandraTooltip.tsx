import moment from "moment";
import { formatNumber, ENumberStyle } from "src/api/utils/format";

export type TCustomTooltip = {
    series: number[][];
    seriesIndex: number;
    dataPointIndex: number;
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
}: TCustomTooltip) => {
    const isPredictions = seriesIndex !== 0;

    const seriesNameMap = {
        0: "Price",
        1: "Bullish",
        2: "Base",
        3: "Bearish",
    };

    return (
        <div className="px-2.5 py-2 flex flex-col break-word rounded-[5px] bg-backgroundVariant100 border-[0.5px] border-borderLine fontGroup-support text-primary">
            {isPredictions ? (
                <div>
                    <div className="mb-2 flex justify-between w-full">
                        <div className="text-white capitalize fontGroup-support !font-semibold inline">
                            <div className="inline-flex mr-1.5 mb-0.5 self-start bg-success w-1 h-1 rounded-full" />
                            {seriesNameMap[1]}: {}
                        </div>
                        <div className="inline ml-1">
                            {
                                formatNumber({
                                    value: series[1][dataPointIndex],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </div>
                    </div>
                    <div className="mb-2 flex justify-between w-full">
                        <div className="text-white capitalize fontGroup-support !font-semibold inline">
                            <div className="inline-flex mr-1.5 mb-0.5 self-start bg-secondaryYellowGreen w-1 h-1 rounded-full" />
                            {seriesNameMap[2]}: {}
                        </div>
                        <div className="inline ml-1">
                            {
                                formatNumber({
                                    value: series[2][dataPointIndex],
                                    style: ENumberStyle.Currency,
                                    currency: "USD",
                                }).value
                            }
                        </div>
                    </div>
                    <div className="mb-2 flex justify-between w-full">
                        <div className="text-white capitalize fontGroup-support !font-semibold inline">
                            <div className="inline-flex mr-1.5 mb-0.5 self-start bg-secondaryOrangeSoda w-1 h-1 rounded-full" />
                            {seriesNameMap[3]}: {}
                        </div>
                        <div className="inline ml-1">
                            {
                                formatNumber({
                                    value: series[3][dataPointIndex],
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
