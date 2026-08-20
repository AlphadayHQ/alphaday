import { FC } from "react";
import { TFeesItem, TFeesMetric } from "src/api/types";
import { imgOnError } from "src/api/utils/errorHandling";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import logoDay from "src/assets/png/logo-white.png";

const COLUMN_WIDTHS = {
    INDEX: 0.4,
    NAME: 4,
    DATUM: 2.5,
};

export const FeesItemsHeader: FC<{ metric: TFeesMetric }> = ({ metric }) => {
    return (
        <div className="flex flex-row flex-[1_auto] py-[10px] px-6 pb-[3px]">
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.INDEX,
                }}
            />
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.NAME,
                }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0 justify-start">
                    Name
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center justify-end"
                style={{
                    flex: COLUMN_WIDTHS.DATUM,
                }}
            >
                <div className="whitespace-nowrap fontGroup-support text-primaryVariant100 mb-0">
                    {metric === "total" ? "Fees (24h)" : "Revenue (24h)"}
                </div>
            </div>
        </div>
    );
};

interface IFeesItemProps {
    item: TFeesItem;
    index: number;
}

export const FeesItem: FC<IFeesItemProps> = ({ item, index }) => {
    return (
        <div className="flex flex-row flex-[1_auto] py-[10px] px-4">
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.INDEX,
                }}
            >
                <div className="flex flex-row justify-start flex-1 items-center fontGroup-supportBold">
                    {index + 1}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.NAME,
                }}
            >
                <div className="flex flex-row flex-[0_1_auto] h-[21px] w-[21px] relative overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-background" />
                    <img
                        src={item.icon}
                        onError={imgOnError}
                        alt=""
                        className="absolute inset-0 bg-background rounded-full"
                        style={{
                            backgroundImage: `url(${logoDay})`,
                        }}
                    />
                </div>
                <div className="text-primary fontGroup-highlightSemi ml-1.5">
                    {item.name}
                </div>
            </div>
            <div
                className="flex flex-row flex-1 items-center"
                style={{
                    flex: COLUMN_WIDTHS.DATUM,
                }}
            >
                <div className="flex flex-row flex-1 items-center justify-end">
                    {
                        formatNumber({
                            value: item.value,
                            style: ENumberStyle.Currency,
                            currency: "USD",
                        }).value
                    }
                </div>
            </div>
        </div>
    );
};
