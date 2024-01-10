import { FC, memo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TGasConsumptionDict, TAssetValue, TGasPrices } from "src/api/types";
import GasHeadingInfo from "./GasHeadingInfo";
import GasPriceBoard from "./GasPriceBoard";
import GasPriceTable, { TGasPriceTable } from "./GasPriceTable";

export interface IGasModule {
    gasPrices: TGasPrices | undefined;
    ethPrice: TAssetValue | undefined;
    loading: boolean;
    gasConstants: TGasConsumptionDict;
    beaconChain: TGasPriceTable | undefined;
}

const GasModule: FC<IGasModule> = memo(function GasModule({
    ethPrice,
    loading,
    gasConstants,
    gasPrices,
    beaconChain,
}) {
    return loading || !gasPrices ? (
        <ModuleLoader $height="400px" />
    ) : (
        <div className="pt-3 px-5 pb-0.5">
            <div className="w-full h-auto">
                <GasHeadingInfo data={gasPrices} ethPrice={ethPrice} />
            </div>
            {beaconChain ? (
                <GasPriceTable {...beaconChain} />
            ) : (
                <GasPriceBoard
                    gasPrices={gasPrices}
                    ethPrice={ethPrice}
                    gasConstants={gasConstants}
                />
            )}
        </div>
    );
});

export default GasModule;
