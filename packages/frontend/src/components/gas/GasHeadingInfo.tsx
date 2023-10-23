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
            <div className="w-full text-uppercase text-primary my-5">
                Latest Gas price{" "}
                <span className="text-highlight text-primary-variant-100 text-lowercase">
                    (Gwei)
                </span>
            </div>
            <div className="flex flex-wrap justify-between items-center">
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
