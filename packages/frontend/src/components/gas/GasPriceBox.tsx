import { FC, HTMLProps } from "react";
import { twMerge, Skeleton } from "@alphaday/ui-kit";

const GasSkeleton = () => (
    <div className="h-10">
        <Skeleton
            style={{
                minWidth: "30px",
                width: "40px",
                height: "22px",
            }}
        />
        <Skeleton
            style={{
                minWidth: "30px",
                width: "40px",
                height: "12px",
                marginTop: "8px",
            }}
        />
    </div>
);

const GasPriceTitle: FC<HTMLProps<HTMLHeadingElement>> = ({
    children,
    className,
    ...props
}) => (
    <h6
        className={twMerge(
            "text-support text-center text-uppercase mb-7",
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
        <div className="flex flex-col justify-center items-center border btn-ring-variant-300 box-border rounded-10 min-w-90 p-0 w-30 h-91">
            {type === "fast" && (
                <GasPriceTitle className="text-success">{type}</GasPriceTitle>
            )}
            {type === "standard" && (
                <GasPriceTitle className="text-primaryVariant100">
                    {type}
                </GasPriceTitle>
            )}
            {type === "slow" && (
                <GasPriceTitle className="text-red-400">{type}</GasPriceTitle>
            )}
            <div className="whitespace-nowrap text-major text-center">
                {gweiPrice && usdPrice ? (
                    <div>
                        <p className="text-primary mb-0 text-center">
                            {gweiPrice}
                        </p>
                        <p className="text-primary mb-0 text-center text-primary-variant-100 mt-6">
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
