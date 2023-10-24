import { FC } from "react";
import { TGasConsumptionDict, TAssetValue, TGasPrices } from "src/api/types";
import Item from "./Item";

interface IGasPriceBoard {
    gasPrices: TGasPrices;
    ethPrice: TAssetValue | undefined;
    gasConstants: TGasConsumptionDict;
}
const GasPriceBoard: FC<IGasPriceBoard> = ({
    gasPrices,
    ethPrice,
    gasConstants,
}) => {
    return (
        <div className="mt-5 mb-4">
            <Item
                img=""
                title="Network"
                gasUnits={0}
                type="title"
                gasPrices={gasPrices}
                ethPrice={ethPrice}
            />
            {Object.values(gasConstants)
                .sort((a, d) => a.SWAP - d.SWAP)
                .map((item) => (
                    <Item
                        key={item.NAME}
                        img={String(item.IMG)}
                        title={item.NAME}
                        gasUnits={item.SWAP}
                        gasPrices={gasPrices}
                        ethPrice={ethPrice}
                    />
                ))}
        </div>
    );
};

export default GasPriceBoard;
