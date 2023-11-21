import { useEffect, useState, FC, useMemo } from "react";
import { useHover, useLayer, useMousePositionAsTrigger } from "react-laag";
import { toast } from "src/api/utils/toastUtils";
import CONFIG from "src/config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

const PIE_COLORS = {
    maxSupply: { color: "#654ee7" },
    supply: { color: "#E08787" },
    warChest: { color: "#B9E187" },
    pov: { color: "#477FF7" },
};

export interface IPieChartData {
    name: string;
    ticker: string;
    address: string;
    totalSupply: string;
    maxSupply: string;
    supply: string;
    supplyChartLabel: string;
    warChestChartLabel: string;
    povChartLabel: string;
    maxSupplyChartLabel: string;
    disclaimer?: string;
    faqLink?: {
        value: string;
        href: string;
    };
    moreLink?: {
        value: string;
        href: string;
    };
}

export interface IPieChart {
    data: IPieChartData;
}

const PieChartModule: FC<IPieChart> = ({ data }) => {
    const {
        name,
        ticker,
        address,
        totalSupply,
        maxSupply,
        supply,
        supplyChartLabel,
        warChestChartLabel,
        povChartLabel,
        maxSupplyChartLabel,
        disclaimer,
        faqLink,
        moreLink,
    } = data;

    const [tooltipProp, setTooltipProp] = useState<{
        text: string | undefined;
        bg: string | undefined;
    }>({ text: undefined, bg: undefined });

    const [isOver, hoverProps] = useHover();
    const { handleMouseEvent, trigger, parentRef } = useMousePositionAsTrigger({
        enabled: isOver,
    });
    const { triggerProps, layerProps, renderLayer } = useLayer({
        isOpen: isOver,
        overflowContainer: false, // overflow the parent container
        auto: true, // automatically find the best placement
        snap: true, // stick to the possiblePlacements
        possiblePlacements: ["right-end", "right-center", "right-start"],
        placement: "right-start",
        triggerOffset: 8, // distance from pointer
        containerOffset: 16, // distance from container
        trigger,
    });

    useEffect(() => {
        const handlePov = () => {
            setTooltipProp({
                text: povChartLabel,
                bg: PIE_COLORS.pov.color,
            });
        };
        const handleWarChest = () => {
            setTooltipProp({
                text: warChestChartLabel,
                bg: PIE_COLORS.warChest.color,
            });
        };
        const handleSupply = () => {
            setTooltipProp({
                text: supplyChartLabel,
                bg: PIE_COLORS.supply.color,
            });
        };
        const handleMaxSupply = () => {
            setTooltipProp({
                text: maxSupplyChartLabel,
                bg: PIE_COLORS.maxSupply.color,
            });
        };
        const povEl = document.getElementById("pov");
        const warChestEl = document.getElementById("warChest");
        const supplyEl = document.getElementById("supply");
        const maxSupplyEl = document.getElementById("maxSupply");
        if (povEl) {
            povEl.addEventListener("mouseenter", handlePov);
        }
        if (warChestEl) {
            warChestEl.addEventListener("mouseenter", handleWarChest);
        }
        if (supplyEl) {
            supplyEl.addEventListener("mouseenter", handleSupply);
        }
        if (maxSupplyEl) {
            maxSupplyEl.addEventListener("mouseenter", handleMaxSupply);
        }

        return () => {
            if (povEl) {
                povEl.removeEventListener("mouseenter", handlePov);
            }
            if (warChestEl) {
                warChestEl.removeEventListener("mouseenter", handleWarChest);
            }
            if (supplyEl) {
                supplyEl.removeEventListener("mouseenter", handleSupply);
            }
            if (maxSupplyEl) {
                maxSupplyEl.removeEventListener("mouseenter", handleMaxSupply);
            }
        };
    }, [
        maxSupply,
        maxSupplyChartLabel,
        povChartLabel,
        supplyChartLabel,
        totalSupply,
        warChestChartLabel,
    ]);

    const newLayerProps = useMemo(
        () => ({
            ...layerProps,
            style: {
                ...layerProps.style,
                ...(isOver && { zIndex: Z_INDEX_REGISTRY.PIE_CHART_TOOLTIP }),
            },
        }),
        [layerProps, isOver]
    );

    return (
        <div ref={parentRef}>
            <div className="p-[15px]">
                <div className="flex justify-between items-center tiny:flex-col mb-[10px]">
                    {isOver &&
                        renderLayer(
                            <div {...newLayerProps}>
                                <div
                                    className="fontGroup-highlightSemi ring-1 ring-backgroundVariant100 text-backgroundVariant100 p-[10px] rounded"
                                    style={{ background: tooltipProp.bg }}
                                >
                                    {tooltipProp.text}
                                </div>
                            </div>
                        )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="219"
                        height="229"
                        viewBox="0 0 219 229"
                        fill="none"
                        onMouseLeave={() =>
                            setTooltipProp((prev) => ({
                                ...prev,
                                text: undefined,
                            }))
                        }
                    >
                        <path
                            id="maxSupply"
                            {...hoverProps}
                            {...triggerProps}
                            onMouseMove={handleMouseEvent}
                            d="M107 0V17.5C157.5 25 175.5 35 202 80.5L218.5 72.5C188.692 23.1835 164.964 6.27561 107 0Z"
                            fill={PIE_COLORS.maxSupply.color}
                            stroke={PIE_COLORS.maxSupply.color}
                        />
                        <path
                            id="supply"
                            {...hoverProps}
                            {...triggerProps}
                            onMouseMove={handleMouseEvent}
                            d="M106 18.7561C125.919 18.7561 145.42 24.4628 162.197 35.2008L139.718 70.3205C129.652 63.8777 117.951 60.4537 106 60.4537V18.7561Z"
                            fill={PIE_COLORS.supply.color}
                            stroke={PIE_COLORS.supply.color}
                            strokeWidth="2"
                        />
                        <path
                            id="warChest"
                            {...hoverProps}
                            {...triggerProps}
                            onMouseMove={handleMouseEvent}
                            d="M162.197 35.2008C179.579 46.3265 193.268 62.3614 201.529 81.2739L163.317 97.9644C158.361 86.6168 150.147 76.9959 139.718 70.3205L162.197 35.2008Z"
                            fill={PIE_COLORS.warChest.color}
                            stroke={PIE_COLORS.warChest.color}
                            strokeWidth="2"
                        />
                        <path
                            id="pov"
                            {...hoverProps}
                            {...triggerProps}
                            onMouseMove={handleMouseEvent}
                            d="M201.529 81.2739C210.514 101.846 212.619 124.768 207.53 146.632C202.441 168.496 190.43 188.133 173.284 202.622C156.137 217.111 134.772 225.679 112.365 227.049C89.9589 228.42 67.7085 222.521 48.9239 210.23C30.1393 197.939 15.8242 179.913 8.10795 158.832C0.391694 137.752 -0.313442 114.743 6.09743 93.2298C12.5083 71.7162 25.6927 52.8469 43.6893 39.4287C61.686 26.0104 83.5334 18.76 105.982 18.7561L105.989 60.4537C92.52 60.456 79.4116 64.8062 68.6136 72.8572C57.8156 80.9082 49.905 92.2298 46.0585 105.138C42.2119 118.046 42.635 131.851 47.2648 144.499C51.8945 157.148 60.4836 167.963 71.7543 175.338C83.0251 182.713 96.3753 186.252 109.819 185.43C123.263 184.607 136.082 179.467 146.37 170.773C156.658 162.08 163.864 150.298 166.918 137.179C169.971 124.061 168.708 110.307 163.317 97.9644L201.529 81.2739Z"
                            fill={PIE_COLORS.pov.color}
                            stroke={PIE_COLORS.pov.color}
                            strokeWidth="2"
                        />
                    </svg>
                    <div className="fontGroup-normal">
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Token Name:
                            </span>{" "}
                            {name}
                        </div>
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Token Ticker:
                            </span>{" "}
                            ${ticker}
                        </div>
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Smart contract address:
                            </span>{" "}
                            <span
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(address)
                                        .then(() =>
                                            toast("Copied to clipboard")
                                        )
                                        .catch(() =>
                                            toast("Could not copy address")
                                        );
                                }}
                            >
                                {`${address.substr(0, 6)}...${address.substr(
                                    address.length - 4
                                )}`}
                            </span>
                        </div>
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Total supply:
                            </span>{" "}
                            {totalSupply}
                        </div>
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Max. Circulating supply:
                            </span>{" "}
                            {maxSupply}
                        </div>
                        <div className="mx-4 my-1">
                            <span className="fontGroup-highlight capitalize">
                                Circulating supply:
                            </span>{" "}
                            {supply}
                        </div>
                    </div>
                </div>
                {disclaimer !== "undefined" && (
                    <div className="fontGroup-normal py-0 px-[10px]">
                        {disclaimer}
                    </div>
                )}
                <div className="p-[10px] fontGroup-normal">
                    {faqLink !== undefined && (
                        <a
                            className="text-primary pr-[10px] hover:text-primaryVariant100"
                            href={faqLink.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {faqLink.value}
                        </a>
                    )}
                    {moreLink !== undefined && (
                        <a
                            href={moreLink.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {moreLink.value}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PieChartModule;
