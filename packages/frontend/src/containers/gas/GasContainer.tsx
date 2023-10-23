import { FC } from "react";
import {
    useGetMarketDataQuery,
    useGetMultiKeyValueQuery,
} from "src/api/services";
import { TGasPrices } from "src/api/types";
import { buildMultiValue } from "src/api/utils/itemUtils";
import GasModule from "src/components/gas/GasModule";
import { TGasPriceTable } from "src/components/gas/GasPriceTable";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";
import { AVG_GAS_USED } from "./staticData";

const BEACON_CHAIN_DATA = {
    BEACON_CURRENT_EPOCH: "currentEpoch",
    BEACON_CURRENT_SLOT: "currentSlot",
    BEACON_ACTIVE_VALIDATORS: "activeValidators",
    BEACON_AVG_VALIDATORS_BALANCE: "avgValidatorBalance",
    BEACON_FINALIZED_EPOCH: "finalizedEpoch",
    BEACON_FINALIZED_SLOT: "finalizedSlot",
    BEACON_REWARDS_APR: "rewardsApr",
};

const GAS_PRICE_DATA = {
    GAS_SLOW: "slow",
    GAS_STANDARD: "standard",
    GAS_FAST: "fast",
};

const GasContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const { template } = moduleData.widget;
    const isBeaconWidget = template?.slug === "network_template";

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.NETWORK.POLLING_INTERVAL) * 1000;

    const {
        data: gasData,
        isLoading: isLoadingGasData,
    } = useGetMultiKeyValueQuery(
        {
            keys: Object.keys(GAS_PRICE_DATA),
        },
        { pollingInterval }
    );

    const {
        data: ethPriceResponse,
        isLoading: isLoadingEthPrice,
    } = useGetMarketDataQuery(
        {
            tags: "ethereum",
            limit: 1,
        },
        {
            pollingInterval,
        }
    );

    const {
        data: beaconData,
        isLoading: isLoadingBeaconChain,
    } = useGetMultiKeyValueQuery(
        {
            keys: Object.keys(BEACON_CHAIN_DATA),
        },
        {
            pollingInterval,
            skip: !isBeaconWidget,
        }
    );

    const ethPrice =
        ethPriceResponse?.results[0]?.price !== undefined
            ? {
                  value: ethPriceResponse?.results[0]?.price,
                  denomination: "usd",
              }
            : undefined;

    const chainData = buildMultiValue<TGasPriceTable>(
        beaconData?.results || [],
        BEACON_CHAIN_DATA
    );

    const gasPrices = buildMultiValue<TGasPrices>(
        gasData?.results || [],
        GAS_PRICE_DATA
    );

    return (
        <GasModule
            gasPrices={
                gasData?.results && {
                    fast: Number(gasPrices.fast),
                    standard: Number(gasPrices.standard),
                    slow: Number(gasPrices.slow),
                }
            }
            ethPrice={ethPrice}
            loading={
                isLoadingGasData || isLoadingEthPrice || isLoadingBeaconChain
            }
            gasConstants={AVG_GAS_USED}
            beaconChain={isBeaconWidget ? chainData : undefined}
        />
    );
};

export default GasContainer;
