import { FC } from "react";
import { TAssetValue, TGasPrices } from "src/api/types";
import CONFIG from "src/config";

const { GWEI_PER_ETH } = CONFIG.NUMBERS;

interface IProps {
    img: string;
    title: string;
    gasUnits: number;
    type?: "title";
    gasPrices: TGasPrices | undefined;
    ethPrice: TAssetValue | undefined;
}

const Item: FC<IProps> = ({
    ethPrice,
    type,
    img,
    title,
    gasUnits,
    gasPrices,
}) => {
    if (ethPrice && gasPrices) {
        if (type) {
            return (
                <div className="flex w-full items-center justify-between relative">
                    <span className={`ml-10 ${type ? "ml-0" : "ml-10"}`}>
                        {title}
                    </span>
                    <div className="grid grid-cols-3 gap-10 float-right">
                        <span
                            className={`ml-auto text-right ${
                                type ? "text-primaryVariant100" : "text-primary"
                            }`}
                        >
                            Fast (est.)
                        </span>

                        <span
                            className={`ml-auto text-right ${
                                type ? "text-primaryVariant100" : "text-primary"
                            }`}
                        >
                            Standard (est.)
                        </span>

                        <span
                            className={`ml-auto text-right ${
                                type ? "text-primaryVariant100" : "text-primary"
                            }`}
                        >
                            Slow (est.)
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex w-full items-center justify-between relative">
                <div className="item-wrapper">
                    <img
                        className="w-21 h-21 relative top-[-1px] rounded-full"
                        src={img}
                        alt="Item"
                    />
                    <span className={`ml-10 ${type ? "ml-0" : "ml-10"}`}>
                        {title}
                    </span>
                </div>

                <div className="values grid grid-cols-3 gap-10 float-right">
                    {gasPrices &&
                        Object.entries(gasPrices).map(([key, value]) => (
                            <span
                                key={key}
                                className={`ml-auto text-right ${
                                    type
                                        ? "text-primaryVariant100"
                                        : "text-primary"
                                }`}
                            >
                                {Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(
                                    (gasUnits / GWEI_PER_ETH) *
                                        Number(value) *
                                        ethPrice.value
                                )}
                            </span>
                        ))}
                </div>
            </div>
        );
    }
    return <></>;
};

export default Item;
