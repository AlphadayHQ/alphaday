import { FC, useState, useEffect, useRef } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { useGetYieldsQuery } from "src/api/services";
import { TYieldPool } from "src/api/types";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import YieldsModule from "src/components/yields/YieldsModule";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.YIELDS;

const YieldsContainer: FC<IModuleContainer> = ({
    moduleData,
    mobileViewWidgetHeight,
}) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>();

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.YIELDS.POLLING_INTERVAL) * 1000;

    const {
        currentData: yieldsDataResponse,
        isLoading,
        isSuccess,
    } = useGetYieldsQuery(
        {
            page: currentPage,
        },
        {
            pollingInterval,
        }
    );
    const prevYieldsDataResponseRef = useRef<TYieldPool[]>();

    const { nextPage, handleNextPage } = usePagination(
        yieldsDataResponse?.links,
        MAX_PAGE_NUMBER,
        isSuccess
    );

    const yieldsDataForCurrentPage = [...(yieldsDataResponse?.results ?? [])];

    const [yieldsData, setYieldsData] = useState<TYieldPool[]>([]);

    // If the current response changes, it means the request parameters changed
    // This happens when the user scrolled to the bottom.
    if (
        yieldsDataResponse?.results !== undefined &&
        prevYieldsDataResponseRef.current !== yieldsDataResponse?.results
    ) {
        setYieldsData((prevState) => [
            ...prevState,
            ...yieldsDataForCurrentPage,
        ]);
        prevYieldsDataResponseRef.current = yieldsDataResponse?.results;
    }

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) return () => null;
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    return (
        <YieldsModule
            yieldsData={buildUniqueItemList(yieldsData)}
            isLoading={isLoading}
            widgetHeight={mobileViewWidgetHeight ?? widgetHeight}
            handlePaginate={handleNextPage}
        />
    );
};

export default YieldsContainer;
