import { FC } from "react";
import { KeyValueTable } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
    }).format(value);

export type TGasPriceTable = {
    currentSlot: number;
    finalizedSlot: number;
    currentEpoch: number;
    finalizedEpoch: number;
    activeValidators: number;
    avgValidatorBalance: number;
    // rewardsApr: number;
};

const GasPriceTable: FC<TGasPriceTable> = ({
    currentEpoch,
    currentSlot,
    activeValidators,
    avgValidatorBalance,
    finalizedEpoch,
    finalizedSlot,
}) => {
    const { t } = useTranslation();

    const items = [
        [
            {
                title: "Current Slot",
                value: formatNumber(currentSlot),
            },
            {
                title: "Finalized Slot",
                value: formatNumber(finalizedSlot),
            },
        ],
        [
            {
                title: "Current Epoch",
                value: formatNumber(currentEpoch),
            },
            {
                title: "Finalized Epoch",
                value: formatNumber(finalizedEpoch),
            },
        ],
        [
            {
                title: "Active Validators",
                value: formatNumber(activeValidators),
            },
            {
                title: "Average Validator Balance",
                value: `${formatNumber(avgValidatorBalance)} ETH`,
            },
        ],
    ];
    return (
        <>
            <div className="w-full text-uppercase text-primary mb-5 mt-4">
                {t("gas.beaconChainData")}
            </div>
            <KeyValueTable items={items} />
        </>
    );
};

export default GasPriceTable;
