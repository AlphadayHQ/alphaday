import { FC, useMemo, memo, FormEvent } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import useElementSize from "src/api/hooks/useElementSize";
import { TYieldPool } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import { YieldItem, YieldItemsHeader } from "./YieldItem";

interface IYields {
    isLoading: boolean;
    yieldsData: TYieldPool[] | undefined;
    widgetHeight: number;
    handlePaginate: (type: "next" | "previous") => void;
}

const YieldsModule: FC<IYields> = memo(function YieldsModule({
    isLoading,
    yieldsData,
    widgetHeight,
    handlePaginate,
}) {
    const [squareRef, { width }] = useElementSize();

    const THRESHOLD = 475;
    const LIST_HEADER_HEIGHT = 28;
    const LIST_HEIGHT = useMemo(
        () =>
            width >= THRESHOLD
                ? widgetHeight - LIST_HEADER_HEIGHT
                : widgetHeight,
        [widgetHeight, width]
    );

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    if (isLoading) {
        return <ModuleLoader $height={`${LIST_HEIGHT}px`} />;
    }

    return (
        <div ref={squareRef}>
            <div className="relative p-0">
                {yieldsData?.length !== 0 && width >= THRESHOLD && (
                    <YieldItemsHeader />
                )}
                <ul className="mt-0" style={{ height: `${LIST_HEIGHT}px` }}>
                    {yieldsData !== undefined && yieldsData?.length !== 0 ? (
                        <ScrollBar
                            className="pr-[3px] px-2"
                            onScroll={handleListScroll}
                        >
                            {yieldsData?.map((pool, i) => (
                                <li
                                    className="flex items-center border-b border-borderLine p-0 [&:nth-of-type(1)]:border-top-0"
                                    key={pool.id}
                                >
                                    <YieldItem pool={pool} index={i} />
                                </li>
                            ))}
                        </ScrollBar>
                    ) : (
                        <div className="flex w-full h-full justify-center items-center bg-background">
                            <p className="text-primary fontGroup-highlightSemi">
                                {globalMessages.queries.noMatchFound("yields")}
                            </p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
});

export default YieldsModule;
