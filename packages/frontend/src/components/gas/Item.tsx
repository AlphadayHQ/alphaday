import { FC } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    if (ethPrice && gasPrices) {
        if (type === "title") {
            return (
                <div className="capitalize fontGroup-support text-primaryVariant100 mb-2">
                    <div className="grid grid-cols-4 md-gap-10 gap-5">
                        <span className="ml-0">{title}</span>
                        <span className="ml-auto text-right">
                            {t("gas.fast")} (est.)
                        </span>

                        <span className="ml-auto text-right">
                            {t("gas.standard")} (est.)
                        </span>

                        <span className="ml-auto text-right">
                            {t("gas.slow")} (est.)
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="py-2.5 [&:last-child]:pb-0">
                <div className="grid grid-cols-4 md-gap-10 gap-5">
                    <div className="flex">
                        <img
                            className="w-5 h-5 rounded-full"
                            src={img}
                            alt="Item"
                        />
                        <span className="ml-3 fontGroup-highlightSemi">
                            {title}
                        </span>
                    </div>
                    {gasPrices &&
                        Object.entries(gasPrices).map(([key, value]) => (
                            <div key={key} className="text-right text-primary">
                                {Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(
                                    (gasUnits / GWEI_PER_ETH) *
                                        Number(value) *
                                        ethPrice.value
                                )}
                            </div>
                        ))}
                </div>
            </div>
        );
    }
    return null;
};

export default Item;
