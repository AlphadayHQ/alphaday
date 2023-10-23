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
                <div className="flex w-full items-center justify-between relative uppercase fontGroup-support">
                    <span className="ml-0">{title}</span>
                    <div className="grid grid-cols-3 gap-10 float-right">
                        <span className="ml-auto text-right text-primaryVariant100">
                            Fast (est.)
                        </span>

                        <span className="ml-auto text-right text-primaryVariant100">
                            Standard (est.)
                        </span>

                        <span className="ml-auto text-right text-primaryVariant100">
                            Slow (est.)
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex w-full items-center justify-between relative py-3 [&:last-child]:pb-0">
                <div className="item-wrapper flex items-center">
                    <img
                        className="w-5 h-5 rounded-full"
                        src={img}
                        alt="Item"
                    />
                    <span className="ml-3 font-bold">{title}</span>
                </div>

                <div className="grid grid-cols-3 gap-10 float-right">
                    {gasPrices &&
                        Object.entries(gasPrices).map(([key, value]) => (
                            <span
                                key={key}
                                className="ml-auto text-right text-primary"
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
    return null;
};

export default Item;
