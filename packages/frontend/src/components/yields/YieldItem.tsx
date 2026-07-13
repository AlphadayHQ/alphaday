import { FC } from "react";
import { TYieldPool } from "src/api/types";
import { formatNumber, ENumberStyle } from "src/api/utils/format";

const COLUMN_WIDTHS = {
    INDEX: 0.4,
    NAME: 4,
    CHAIN: 2,
    APY: 1.6,
    TVL: 2,
};

export const YieldItemsHeader: FC = () => {
    return (
        <div className="flex flex-row flex-[1_auto] py-[10px] px-6 pb-[3px]">
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.INDEX }}
            />
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.NAME }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0 justify-start">
                    Pool
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.CHAIN }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0">
                    Chain
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center justify-end"
                style={{ flex: COLUMN_WIDTHS.APY }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0">
                    APY
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center justify-end"
                style={{ flex: COLUMN_WIDTHS.TVL }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0">
                    TVL
                </div>
            </div>
        </div>
    );
};

interface IYieldItemProps {
    pool: TYieldPool;
    index: number;
}

export const YieldItem: FC<IYieldItemProps> = ({ pool, index }) => {
    return (
        <div className="flex flex-row flex-[1_auto] py-[10px] px-2">
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.INDEX }}
            >
                <div className="flex flex-row justify-start pr-2 flex-1 items-center fontGroup-supportBold">
                    {index + 1}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.NAME }}
            >
                <div className="flex flex-col min-w-0">
                    <span className="text-primary fontGroup-highlightSemi truncate capitalize">
                        {pool.project.replace(/-/g, " ")}
                    </span>
                    <span className="fontGroup-support text-primaryVariant100 truncate uppercase">
                        {pool.symbol}
                    </span>
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.CHAIN }}
            >
                <div className="flex flex-row flex-1 items-center justify-start truncate">
                    {pool.chain}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.APY }}
            >
                <div className="flex flex-row flex-1 items-center justify-end text-success">
                    {
                        formatNumber({
                            value: pool.apy / 100,
                            style: ENumberStyle.Percent,
                        }).value
                    }
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{ flex: COLUMN_WIDTHS.TVL }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {
                        formatNumber({
                            value: pool.tvlUsd,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </div>
            </div>
        </div>
    );
};
