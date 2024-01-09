import { FC, useState, useEffect, useRef } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { TBaseTag, useGetTvlQuery } from "src/api/services";
import { selectTvlProjectType, setSelectedTvlProjectType } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TProjectData, TProjectTvlHistory } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { itemListsAreEqual } from "src/api/utils/itemUtils";
import TvlModule from "src/components/tvl/TvlModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const { MAX_PAGE_NUMBER } = CONFIG.WIDGETS.TVL;

const TvlContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    const widgetHeight = useWidgetHeight(moduleData);

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    // TODO: default to protocol once backend is fixed
    const selectedProjectType =
        useAppSelector(selectTvlProjectType(moduleData.hash)) ?? "chain";

    const [currentPage, setCurrentPage] = useState<number | undefined>();
    // we need a separate state variable for tags so that we can make sure the
    // parameters to the useGetTvlQuery (page & tags) change at the same time
    // otherwise, tags change -> request triggered -> we detect tags change and
    // reset page -> request trigggered again.
    const [currentTags, setCurrentTags] = useState<TBaseTag[] | undefined>(
        tags
    );

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.TVL.POLLING_INTERVAL) * 1000;

    const {
        currentData: tvlDataResponse,
        isLoading,
        isSuccess,
    } = useGetTvlQuery(
        {
            page: currentPage,
            tags: currentTags ? filteringListToStr(currentTags) : undefined,
            project_type: selectedProjectType,
        },
        {
            pollingInterval,
        }
    );
    const prevTvlDataResponseRef = useRef<TProjectData[]>();

    const {
        nextPage,
        handleNextPage,
        reset: resetPagination,
    } = usePagination(tvlDataResponse?.links, MAX_PAGE_NUMBER, isSuccess);

    const tvlDataForCurrentPage = [...(tvlDataResponse?.results ?? [])];

    const [tvlData, setTvlData] = useState<TProjectData[]>([]);

    const reset = () => {
        if (tvlData.length !== 0) setTvlData([]);
        if (currentPage !== undefined) setCurrentPage(undefined);
        resetPagination();
    };

    // If the current response changes, it means the request parameters changed
    // This happens 1. when user scrolled to the bottom or 2. tags changed.
    // Case 2 is handled separately.
    if (
        tvlDataResponse?.results !== undefined &&
        prevTvlDataResponseRef.current !== tvlDataResponse?.results
    ) {
        setTvlData((prevState) => [...prevState, ...tvlDataForCurrentPage]);
        prevTvlDataResponseRef.current = tvlDataResponse?.results;
    }

    if (tags && !itemListsAreEqual(currentTags || [], tags)) {
        reset();
        setCurrentTags(tags);
    }

    const tvlHistory = tvlData
        ?.map((p) => p.tvlHistories)
        .filter((e) => e !== undefined) as TProjectTvlHistory[];

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

    const handleSwitchProjectType = () => {
        reset();
        dispatch(
            setSelectedTvlProjectType({
                widgetHash: moduleData.hash,
                projectType:
                    selectedProjectType === "protocol" ? "chain" : "protocol",
            })
        );
    };

    return (
        <TvlModule
            projectsTvlData={tvlData}
            projectsTvlHistory={tvlHistory}
            isLoading={isLoading}
            widgetHeight={widgetHeight}
            handlePaginate={handleNextPage}
            selectedProjectType={selectedProjectType}
            onSwitchProjectType={handleSwitchProjectType}
        />
    );
};

export default TvlContainer;
