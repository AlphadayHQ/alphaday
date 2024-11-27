import { FC, HTMLProps } from "react";
import { twMerge, Skeleton } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";

const GasSkeleton = () => (
    <div className="h-10">
        <Skeleton className="min-w-[30px] w-10 h-[22px]" />
        <Skeleton className="min-w-[30px] w-10 h-3 mt-2" />
    </div>
);

const GasPriceTitle: FC<HTMLProps<HTMLHeadingElement>> = ({
    children,
    className,
    ...props
}) => (
    <h6
        className={twMerge(
            "fontGroup-support text-center uppercase mb-2",
            className
        )}
        {...props}
    >
        {children}
    </h6>
);

interface IGasPriceBox {
    type: "fast" | "standard" | "slow";
    gweiPrice: number | undefined;
    usdPrice: number | undefined;
    isCard?: boolean; // if true, the element will be displayed in a feed card
}

const GasPriceBox: FC<IGasPriceBox> = ({
    type,
    gweiPrice,
    usdPrice,
    isCard,
}) => {
    const { t } = useTranslation();
    return (
        <div
            className={twMerge(
                "flex flex-col justify-center items-center border border-borderLine box-border rounded-lg min-w-[90px] w-full p-0 h-[91px]",
                isCard && "w-[70px]"
            )}
        >
            {type === "fast" && (
                <GasPriceTitle className="text-success">
                    {t("gas.fast")}
                </GasPriceTitle>
            )}
            {type === "standard" && (
                <GasPriceTitle className="text-primaryVariant100">
                    {t("gas.standard")}
                </GasPriceTitle>
            )}
            {type === "slow" && (
                <GasPriceTitle className="text-secondaryOrangeSoda">
                    {t("gas.slow")}
                </GasPriceTitle>
            )}
            <div className="whitespace-nowrap text-center">
                {gweiPrice ? (
                    <div>
                        <p className="fontGroup-major text-primary mb-0 text-center">
                            {gweiPrice}
                        </p>
                        <p className="fontGroup-support mb-0 text-center text-primaryVariant100 mt-1">
                            {isCard
                                ? "(gwei)"
                                : usdPrice && `$${usdPrice?.toFixed(2)}`}
                        </p>
                    </div>
                ) : (
                    <GasSkeleton />
                )}
            </div>
        </div>
    );
};

export default GasPriceBox;
