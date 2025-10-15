import { FC, useMemo, useCallback, Suspense, useState, useEffect } from "react";
import { useWidgetHeight, usePagination } from "src/api/hooks";
import { useCustomAnalytics } from "src/api/hooks/useCustomAnalytics";
import {
    useGetPolymarketMarketByTopVolumeQuery,
    useGetPolymarketMarketsQuery,
} from "src/api/services";
import type { TPolymarketMarket } from "src/api/services/polymarket/types";
import { useAppSelector } from "src/api/store/hooks";
import { selectPolymarketFilter } from "src/api/store/slices/widgets";
import * as filterUtils from "src/api/utils/filterUtils";
import { buildUniqueItemList } from "src/api/utils/itemUtils";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import PolymarketModule from "src/components/polymarket/PolymarketModule";
import { EPolymarketFilter } from "src/components/polymarket/types";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import type { IModuleContainer } from "src/types";

const PolymarketTopVolumeContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);
    // const dispatch = useAppDispatch();
    const selectedFilter = useAppSelector(
        selectPolymarketFilter(moduleData.hash)
    );
    const { logButtonClicked } = useCustomAnalytics();

    const [, setSelectedMarket] = useState<TPolymarketMarket | undefined>();
    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );
    const [markets, setMarkets] = useState<TPolymarketMarket[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const tagsString = useMemo(
        () => (tags ? filterUtils.filteringListToStr(tags) : undefined),
        [tags]
    );

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.POLYMARKET.POLLING_INTERVAL) * 1000;

    const {
        data: marketsData,
        isLoading: isLoadingMarkets,
        isSuccess,
    } = useGetPolymarketMarketsQuery(
        {
            page: currentPage,
            limit: CONFIG.API.DEFAULT.DEFAULT_PARAMS.RESPONSE_LIMIT,
            active: true, // Default to showing active markets
            ordering: "-volume_num", // Order by volume descending
            tags: tagsString,
        },
        {
            pollingInterval,
        }
    );

    const { data: topVolumeData, isLoading: isLoadingTopVolume } =
        useGetPolymarketMarketByTopVolumeQuery(
            {
                page: 1,
                limit: 1,
                active: true,
                search: tagsString,
            },
            {
                pollingInterval,
            }
        );

    console.log("topVolumeData", topVolumeData);

    useEffect(() => {
        const data = marketsData?.results;
        if (data !== undefined) {
            setMarkets((prevMarkets) => {
                if (prevMarkets) {
                    return buildUniqueItemList([...prevMarkets, ...data]);
                }
                return data;
            });
        }
    }, [marketsData?.results]);

    const { nextPage, handleNextPage } = usePagination(
        marketsData?.links,
        CONFIG.WIDGETS.POLYMARKET.MAX_PAGE_NUMBER,
        isSuccess
    );

    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    // Reset markets when selected filter or tags change
    useEffect(() => {
        if (selectedFilter !== undefined || tagsString !== undefined) {
            setMarkets(undefined);
            setCurrentPage(undefined);
        }
    }, [selectedFilter, tagsString]);

    const handleSelectMarket = useCallback(
        (market: TPolymarketMarket) => {
            setSelectedMarket(market);
            logButtonClicked({
                buttonName: "polymarket-market",
                data: {
                    widgetName: moduleData.name,
                    marketId: market.id,
                    question: market.question,
                },
            });
            window.open(market.url, "_blank", "noopener,noreferrer");
        },
        [logButtonClicked, moduleData.name]
    );

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT - 55}px`;
    }, [WIDGET_HEIGHT]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <PolymarketModule
                isLoading={isLoadingMarkets}
                markets={markets || marketsData?.results || []}
                onSelectMarket={handleSelectMarket}
                contentHeight={contentHeight}
                selectedFilter={selectedFilter || EPolymarketFilter.Active}
                handlePaginate={handleNextPage}
            />
        </Suspense>
    );
};

export default PolymarketTopVolumeContainer;
