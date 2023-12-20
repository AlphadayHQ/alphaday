import { FC } from "react";
import { TAssetValue, TGasPrices } from "src/api/types";
import CONFIG from "src/config";
import GasPriceBox from "./GasPriceBox";

interface IProps {
    data: TGasPrices;
    ethPrice?: TAssetValue | undefined;
}

const { ETH_TRANSFER_COST, GWEI_PER_ETH } = CONFIG.NUMBERS;

const GasHeadingInfo: FC<IProps> = ({ data, ethPrice }) => {
    return (
        <div className="flex flex-col flex-wrap">
            <div className="w-full capitalize text-primary mb-1.5 fontGroup-highlight">
                Latest Gas price{" "}
                <span className="fontGroup-normal text-primaryVariant100 lowercase">
                    (Gwei)
                </span>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-2.5">
                <GasPriceBox
                    type="slow"
                    gweiPrice={data.slow || 0}
                    usdPrice={
                        ethPrice?.value &&
                        (data.standard * ethPrice.value * ETH_TRANSFER_COST) /
                            GWEI_PER_ETH
                    }
                />
                <GasPriceBox
                    type="standard"
                    gweiPrice={data.standard}
                    usdPrice={
                        ethPrice?.value &&
                        (data.fast * ethPrice.value * ETH_TRANSFER_COST) /
                            GWEI_PER_ETH
                    }
                />
                <GasPriceBox
                    type="fast"
                    gweiPrice={data.fast}
                    usdPrice={
                        ethPrice?.value &&
                        (data.fast * ethPrice.value * ETH_TRANSFER_COST) /
                            GWEI_PER_ETH
                    }
                />
            </div>
        </div>
    );
};

export default GasHeadingInfo;
