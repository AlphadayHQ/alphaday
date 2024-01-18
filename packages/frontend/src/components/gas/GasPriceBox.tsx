import { FC, HTMLProps } from "react";
import { twMerge, Skeleton } from "@alphaday/ui-kit";

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
}

const GasPriceBox: FC<IGasPriceBox> = ({ type, gweiPrice, usdPrice }) => {
    return (
        <div className="flex flex-col justify-center items-center border border-borderLine box-border rounded-lg min-w-[90px] w-full p-0 h-[91px]">
            {type === "fast" && (
                <GasPriceTitle className="text-success">{type}</GasPriceTitle>
            )}
            {type === "standard" && (
                <GasPriceTitle className="text-primaryVariant100">
                    {type}
                </GasPriceTitle>
            )}
            {type === "slow" && (
                <GasPriceTitle className="text-secondaryOrangeSoda">
                    {type}
                </GasPriceTitle>
            )}
            <div className="whitespace-nowrap text-center">
                {gweiPrice && usdPrice ? (
                    <div>
                        <p className="fontGroup-major text-primary mb-0 text-center">
                            {gweiPrice}
                        </p>
                        <p className="fontGroup-support mb-0 text-center text-primaryVariant100 mt-1">
                            ${usdPrice.toFixed(2)}
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
