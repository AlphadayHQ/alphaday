import { FC, useEffect, useMemo, useCallback, Suspense, useState } from "react";
import { useGlobalSearch, useWidgetHeight } from "src/api/hooks";
import {
    TRemoteCoin,
    useGetMarketHistoryQuery,
    useGetPinnedCoinsQuery,
    useTogglePinnedCoinMutation,
} from "src/api/services";
import {
    useGetInsightsQuery,
    useGetPredictionsQuery,
} from "src/api/services/kasandra/kasandraEndpoints";
import { selectIsAuthenticated, setKasandraData } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TBaseEntity, TChartRange, TCoin } from "src/api/types";

import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import KasandraModule from "src/components/kasandra/KasandraModule";
import { TMarketMeta } from "src/components/kasandra/types";
import { ModuleLoader } from "src/components/moduleLoader/ModuleLoader";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";
import BaseContainer from "../base/BaseContainer";

const mockSystemPrompt = `
Analyze the following cryptocurrency data and predict the price movements.

Current Market Data:
- Coin: {coin.name} ({coin.symbol.upper()})
- Current Price: {current_price:.4f}
- Market Cap: {market_cap:,.0f}
- 24h Volume: {volume_24h:,.0f}
- 24h Change: {price_change_24h:.2f}%
- 7d Change: {price_change_7d:.2f}%
- 30d Change: {price_change_30d:.2f}%

Historical Analysis:
{chr(10).join(historical_context)}
{formatted_references}

Target Prediction:
- Prediction Date: {target_date.strftime('%Y-%m-%d')}
- Prediction Interval: {prediction_interval}

Based on the historical data, technical indicators, current market conditions, and any relevant news, provide price predictions for OPTIMISTIC, BASELINE, and PESSIMISTIC scenarios in the following JSON format:

{{
  "predictions": [
    {{
      "case": "optimistic",
      "predicted_price": <predicted price in optimistic scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }},
    {{
      "case": "baseline", 
      "predicted_price": <predicted price in baseline scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }},
    {{
      "case": "pessimistic",
      "predicted_price": <predicted price in pessimistic scenario>,
      "price_percent_change": <percentage change from current price>,
      "probability": <probability of this scenario 0-100>
    }}
  ],
  "most_likely_scenario": "<optimistic, baseline, or pessimistic>",
  "confidence_level": "<high, medium, or low>",
  "technical_analysis": {{
    "overall_trend": "<optimistic, pessimistic, or baseline>",
    "support_levels": [<list of 2-3 support price levels>],
    "resistance_levels": [<list of 2-3 resistance price levels>],
    "key_indicators": [<list of 3-5 key technical/fundamental indicators to watch>]
  }}
}}

Ensure your predictions are data-driven and the probabilities across all scenarios sum to 100.

`;

const transformRemoteCoin = (coin: TRemoteCoin): TCoin => {
    const price = coin.price ?? 0;
    return {
        id: coin.id,
        name: coin.name,
        ticker: coin.ticker,
        slug: coin.slug,
        icon: coin.icon,
        description: coin.description,
        pinned: coin.is_pinned,
        tags:
            coin.tags?.map((t) => ({
                ...t,
                tagType: t.tag_type,
            })) ?? [],
        rank: coin.rank,
        price,
        volume: coin.volume ?? 0,
        marketCap: coin.market_cap ?? 0,
        percentChange24h: coin.price_percent_change_24h ?? 0,
    };
};

const staticCoins: Record<string, TRemoteCoin> = {
    "0": {
        id: 1,
        name: "Bitcoin",
        ticker: "BTC",
        slug: "bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
        project: {
            name: "Bitcoin",
            slug: "bitcoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_bitcoin?w=48&h=48",
        },
        description:
            "Bitcoin (BTC) is a cryptocurrency launched in 2010. Users are able to generate BTC through the process of mining. Bitcoin has a current supply of 19,794,440. The last known price of Bitcoin is 100,893.56218115 USD and is up 2.98 over the last 24 hours. It is currently trading on 11835 active market(s) with $79,744,875,194.36 traded over the last 24 hours. More information can be found at https://bitcoin.org/.",
        price: 83760,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 1663866425862,
        volume: 22678683835.698063,
        price_percent_change_24h: 1.358975987936529,
        rank: 1,
        cmc_id: 1,
        is_pinned: false,
        tags: [],
    },
    "1": {
        id: 31,
        name: "Ethereum",
        ticker: "ETH",
        slug: "ethereum",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        project: {
            name: "Ethereum",
            slug: "ethereum",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum?w=48&h=48",
        },
        description:
            "Ethereum (ETH) is a cryptocurrency . Ethereum has a current supply of 120,445,329.22953065. The last known price of Ethereum is 3,930.37215806 USD and is up 6.26 over the last 24 hours. It is currently trading on 9669 active market(s) with $36,590,724,284.63 traded over the last 24 hours. More information can be found at https://www.ethereum.org/.",
        price: 2022.55,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 244367898193,
        volume: 14366291827.735811,
        price_percent_change_24h: 6.80573476450904,
        rank: 2,
        cmc_id: 1027,
        is_pinned: false,
        tags: [],
    },
    "2": {
        id: 29,
        name: "Tether USDt",
        ticker: "USDT",
        slug: "tether",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        project: {
            name: "Tether",
            slug: "tether",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_tether?w=48&h=48",
        },
        description:
            "Tether USDt (USDT) is a cryptocurrency and operates on the Ethereum platform. Tether USDt has a current supply of 142,193,635,647.06675024 with 139,742,488,654.32559471 in circulation. The last known price of Tether USDt is 0.99986595 USD and is down -0.06 over the last 24 hours. It is currently trading on 108038 active market(s) with $180,638,494,402.18 traded over the last 24 hours. More information can be found at https://tether.to.",
        price: 0.999868,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 143418835596,
        volume: 27191460886.92675,
        price_percent_change_24h: -0.00275757341396873,
        rank: 3,
        // gecko_id: "tether",
        cmc_id: 825,
        is_pinned: false,
        tags: [],
    },
    "3": {
        id: 6,
        name: "XRP",
        ticker: "XRP",
        slug: "xrp",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
        project: {
            name: "Ripple",
            slug: "xrp",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_xrp?w=48&h=48",
        },
        description:
            "XRP (XRP) is a cryptocurrency . XRP has a current supply of 99,986,904,872 with 57,117,231,849 in circulation. The last known price of XRP is 2.42558825 USD and is up 3.63 over the last 24 hours. It is currently trading on 1474 active market(s) with $12,753,795,746.50 traded over the last 24 hours. More information can be found at https://xrpl.org/.",
        price: 2.34,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 135898947545,
        volume: 3116958791.633866,
        price_percent_change_24h: 3.0753716996200997,
        rank: 4,
        // gecko_id: "ripple",
        cmc_id: 52,
        is_pinned: false,
        tags: [],
    },
    "4": {
        id: 89,
        name: "BNB",
        ticker: "BNB",
        slug: "bnb",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
        project: {
            name: "Binance",
            slug: "binancecoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_binance?w=48&h=48",
        },
        description:
            "BNB (BNB) is a cryptocurrency . BNB has a current supply of 144,008,632.85. The last known price of BNB is 724.69300474 USD and is up 5.44 over the last 24 hours. It is currently trading on 2305 active market(s) with $2,410,889,198.96 traded over the last 24 hours. More information can be found at https://bnbchain.org/en.",
        price: 616.95,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 90105219899,
        volume: 1091595009.9722478,
        price_percent_change_24h: -2.395083023849215,
        rank: 5,
        // gecko_id: "binancecoin",
        cmc_id: 1839,
        is_pinned: false,
        tags: [],
    },
    "5": {
        id: 464,
        name: "Solana",
        ticker: "SOL",
        slug: "solana",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
        project: {
            name: "Solana",
            slug: "solana",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_solana?w=48&h=48",
        },
        description:
            "Solana (SOL) is a cryptocurrency launched in 2020. Solana has a current supply of 589,969,265.8029971 with 478,875,613.87371707 in circulation. The last known price of Solana is 232.46059892 USD and is up 4.81 over the last 24 hours. It is currently trading on 808 active market(s) with $5,139,898,261.61 traded over the last 24 hours. More information can be found at https://solana.com.",
        price: 128.63,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 65603027065,
        volume: 2544528066.413763,
        price_percent_change_24h: 4.1020668529609905,
        rank: 6,
        // gecko_id: "solana",
        cmc_id: 5426,
        is_pinned: false,
        tags: [],
    },
    "6": {
        id: 258,
        name: "USDC",
        ticker: "USDC",
        slug: "usd-coin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
        project: {
            name: "USD Coin",
            slug: "usd-coin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_usd-coin?w=48&h=48",
        },
        description:
            "USDC (USDC) is a cryptocurrency and operates on the Ethereum platform. USDC has a current supply of 41,526,903,849.9983605. The last known price of USDC is 0.9995044 USD and is down -0.06 over the last 24 hours. It is currently trading on 23763 active market(s) with $11,550,561,746.95 traded over the last 24 hours. More information can be found at https://www.usdc.com/.",
        price: 0.999854,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 58808017042,
        volume: 8525653434.886081,
        price_percent_change_24h: 0.004115437942133483,
        rank: 7,
        // gecko_id: "usd-coin",
        cmc_id: 3408,
        is_pinned: false,
        tags: [],
    },
    "7": {
        id: 8,
        name: "Dogecoin",
        ticker: "DOGE",
        slug: "dogecoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
        project: {
            name: "Doge",
            slug: "dogecoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_doge?w=48&h=48",
        },
        description:
            "Dogecoin (DOGE) is a cryptocurrency . Users are able to generate DOGE through the process of mining. Dogecoin has a current supply of 147,167,556,383.7052. The last known price of Dogecoin is 0.41544389 USD and is up 4.51 over the last 24 hours. It is currently trading on 1126 active market(s) with $6,203,171,656.65 traded over the last 24 hours. More information can be found at http://dogecoin.com/.",
        price: 0.170655,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 25376127331,
        volume: 885905490.4618752,
        price_percent_change_24h: 2.464172765638683,
        rank: 8,
        // gecko_id: "dogecoin",
        cmc_id: 74,
        is_pinned: false,
        tags: [],
    },
    "8": {
        id: 106,
        name: "Cardano",
        ticker: "ADA",
        slug: "cardano",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
        project: {
            name: "Cardano",
            slug: "cardano",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_cardano?w=48&h=48",
        },
        description:
            "Cardano (ADA) is a cryptocurrency launched in 2017. Cardano has a current supply of 44,995,057,356.925724 with 35,112,728,715.277787 in circulation. The last known price of Cardano is 1.15680575 USD and is up 14.30 over the last 24 hours. It is currently trading on 1388 active market(s) with $2,426,434,509.72 traded over the last 24 hours. More information can be found at https://www.cardano.org.",
        price: 0.723234,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 26018451447,
        volume: 722299795.8234204,
        price_percent_change_24h: 2.9590946496659623,
        rank: 9,
        // gecko_id: "cardano",
        cmc_id: 2010,
        is_pinned: false,
        tags: [],
    },
    "9": {
        id: 101,
        name: "TRON",
        ticker: "TRX",
        slug: "tron",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
        project: {
            name: "Tron",
            slug: "tron",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_tron?w=48&h=48",
        },
        description:
            "TRON (TRX) is a cryptocurrency . TRON has a current supply of 86,252,453,207.273978 with 86,252,441,006.322698 in circulation. The last known price of TRON is 0.30094013 USD and is up 10.30 over the last 24 hours. It is currently trading on 1082 active market(s) with $1,684,777,624.96 traded over the last 24 hours. More information can be found at https://trondao.org/.",
        price: 0.230646,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 21911501409,
        volume: 1588995392.2015536,
        price_percent_change_24h: 2.657229459504969,
        rank: 11,
        // gecko_id: "tron",
        cmc_id: 1958,
        is_pinned: false,
        tags: [],
    },
    "10": {
        id: 104,
        name: "Chainlink",
        ticker: "LINK",
        slug: "chainlink",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
        project: {
            name: "Chainlink",
            slug: "chainlink",
            project_type: "protocol",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_chainlink?w=48&h=48",
        },
        description:
            "Chainlink (LINK) is a cryptocurrency and operates on the Ethereum platform. Chainlink has a current supply of 1,000,000,000 with 626,849,970.45278671 in circulation. The last known price of Chainlink is 28.38008634 USD and is up 25.40 over the last 24 hours. It is currently trading on 1897 active market(s) with $2,604,492,667.71 traded over the last 24 hours. More information can be found at https://chain.link/.",
        price: 14.42,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 9200227132,
        volume: 421623063.04589355,
        price_percent_change_24h: 5.090961594174986,
        rank: 11,
        // gecko_id: "chainlink",
        cmc_id: 1975,
        is_pinned: false,
        tags: [],
    },
    "11": {
        id: 287,
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
        slug: "wrapped-bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
        project: {
            name: "WBTC",
            slug: "wrapped-bitcoin",
            project_type: "protocol",
            network_id: 0,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
        },
        description:
            "Wrapped Bitcoin (WBTC) is a cryptocurrency and operates on the Ethereum platform. Wrapped Bitcoin has a current supply of 236,810.05951794. The last known price of Wrapped Bitcoin is 22,861.46118948 USD and is down -2.05 over the last 24 hours. It is currently trading on 489 active market(s) with $135,148,714.14 traded over the last 24 hours. More information can be found at https://wbtc.network.",
        price: 83741,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 10803109886,
        volume: 221038689.31928885,
        price_percent_change_24h: 1.584409701209175,
        rank: 12,
        // gecko_id: "wrapped-bitcoin",
        cmc_id: 3717,
        is_pinned: false,
        tags: [],
    },
    "12": {
        id: 1555,
        name: "Sui",
        ticker: "SUI",
        slug: "sui",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
        project: {
            name: "Sui",
            slug: "sui",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_sui?w=48&h=48",
        },
        description:
            "Sui (SUI) is a cryptocurrency . Sui has a current supply of 10,000,000,000 with 2,927,660,018.558888 in circulation. The last known price of Sui is 4.69078167 USD and is up 25.77 over the last 24 hours. It is currently trading on 456 active market(s) with $3,805,351,064.08 traded over the last 24 hours. More information can be found at https://sui.io/#.",
        price: 2.36,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 7476086614,
        volume: 607757838.2236912,
        price_percent_change_24h: 4.142643289134332,
        rank: 15,
        // gecko_id: "sui",
        cmc_id: 20947,
        is_pinned: false,
        tags: [],
    },
    "13": {
        id: 508,
        name: "Avalanche",
        ticker: "AVAX",
        slug: "avalanche",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
        project: {
            name: "Avalanche",
            slug: "avalanche-2",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche?w=48&h=48",
        },
        description:
            "Avalanche (AVAX) is a cryptocurrency launched in 2020. Avalanche has a current supply of 448,021,532.92230654 with 409,685,232.92230654 in circulation. The last known price of Avalanche is 51.10255128 USD and is up 13.94 over the last 24 hours. It is currently trading on 818 active market(s) with $967,466,979.13 traded over the last 24 hours. More information can be found at https://avax.network/.",
        price: 19.53,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 8098859284,
        volume: 284262747.90915495,
        price_percent_change_24h: 4.003713873260157,
        rank: 16,
        // gecko_id: "avalanche-2",
        cmc_id: 5805,
        is_pinned: false,
        tags: [],
    },
};

const KasandraContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const prevSelectedMarketData = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]
    );
    const WIDGET_HEIGHT = useWidgetHeight(moduleData);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [prompts, setPrompts] = useState({
        system: mockSystemPrompt,
        user: "",
    });

    const selectedTimestamp = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]?.selectedTimestamp
    );

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.MARKET.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
    );

    const { lastSelectedKeyword } = useGlobalSearch();

    const { data: pinnedCoinsData } = useGetPinnedCoinsQuery();
    const pinnedCoins = useMemo(
        () => pinnedCoinsData?.results || [],
        [pinnedCoinsData]
    );

    const [togglePinMut] = useTogglePinnedCoinMutation();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    // const pollingInterval =
    //     (moduleData.widget.refresh_interval ||
    //         CONFIG.WIDGETS.MARKET.COIN_POLLING_INTERVAL) * 1000;

    // TODO: put this back this once we have the API working
    // const { data: coinsDataResponse, isLoading: isLoadingCoinsData } =
    //     useGetCoinsQuery(
    //         {
    //             tags: tags ? filteringListToStr(tags) : undefined,
    //             limit: CONFIG.WIDGETS.MARKET.QUERY_HARD_LIMIT,
    //         },
    //         {
    //             pollingInterval,
    //         }
    //     );

    const isLoadingCoinsData = false;
    const coinsDataResponse = useMemo(
        () => ({
            results: Object.values(staticCoins).map((remoteCoin) =>
                transformRemoteCoin(remoteCoin)
            ),
        }),
        []
    );

    const coinsData = useMemo(
        () => coinsDataResponse?.results ?? [],
        [coinsDataResponse]
    );

    const selectedMarket: TCoin | undefined = useMemo(() => {
        const storedMarket = [...pinnedCoins, ...coinsData].find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );
        return storedMarket ?? pinnedCoins[0] ?? coinsData[0] ?? undefined;
    }, [prevSelectedMarketData?.selectedMarket, coinsData, pinnedCoins]);

    const { currentData: marketHistory, isFetching: isLoadingHistory } =
        useGetMarketHistoryQuery(
            {
                coin: selectedMarket?.slug,
                interval: selectedChartRange,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined,
            }
        );

    const { currentData: predictions, isFetching: isLoadingPredictions } =
        useGetPredictionsQuery(
            {
                coin: selectedMarket?.slug,
                interval: selectedChartRange,
                limit: 1000,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined,
            }
        );

    const { data: insights } = useGetInsightsQuery({
        coin: selectedMarket?.slug,
        interval: selectedChartRange,
        limit: 24,
    });

    const handleSelectedMarket = useCallback(
        (market: TMarketMeta) => {
            dispatch(setKasandraData({ widgetHash: moduleData.hash, market }));
        },

        [dispatch, moduleData.hash]
    );

    const handleSelectedChartRange = useCallback(
        (chartRange: TChartRange) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    chartRange,
                })
            );
        },

        [dispatch, moduleData.hash]
    );

    const handleTogglePin = useCallback(
        async (coin: TBaseEntity) => {
            try {
                if (!isAuthenticated) {
                    toast(
                        globalMessages.callToAction.signUpToBookmark("coins")
                    );
                    return;
                }
                const isPreviouslyPinned = !!pinnedCoins.find(
                    (c) => c.id === coin.id
                );
                await togglePinMut({ coinId: coin.id }).unwrap();
                toast(
                    `${coin.name} has been ${
                        isPreviouslyPinned ? "unpinned" : "pinned"
                    } successfully`
                );
            } catch (e) {
                Logger.error("MarketContainer::onTogglePin", e);
                toast("Something went wrong, please try again later", {
                    type: EToastRole.Error,
                });
            }
        },
        [isAuthenticated, pinnedCoins, togglePinMut]
    );

    const handleselectedTimestamp = useCallback(
        (timestamp: number) => {
            dispatch(
                setKasandraData({
                    widgetHash: moduleData.hash,
                    timestamp,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    /**
     * if user searches for some keyword and tags are included, automatically set the selected market
     * to some market that matches this new keyword, if any.
     * recall: currently market data should include a single tag per coin
     */
    useEffect(() => {
        if (
            lastSelectedKeyword &&
            tags?.find((t) => t.id === lastSelectedKeyword.tag.id)
        ) {
            const newMarketFromSearch = coinsData.find((marketMeta) => {
                // marketMeta.tags can be [] (an empty array)
                return marketMeta.tags?.[0]?.id === lastSelectedKeyword.tag.id;
            });
            if (newMarketFromSearch) {
                handleSelectedMarket(newMarketFromSearch);
            }
        }
    }, [lastSelectedKeyword, coinsData, tags, handleSelectedMarket]);

    const contentHeight = useMemo(() => {
        return `${WIDGET_HEIGHT}px`;
    }, [WIDGET_HEIGHT]);

    return (
        <BaseContainer
            uiProps={{
                dragProps: undefined,
                isDragging: false,
                onToggleShowFullSize: undefined,
                allowFullSize: false,
                showFullSize: false,
                setTutFocusElemRef: undefined,
            }}
            promptProps={{
                prompts,
                onPromptsChange: (p) => {
                    setPrompts(p);
                },
                selectedMarket,
                selectedChartRange,
            }}
            // TODO (xavier-charles): revert the code below once backend is ready
            moduleData={{
                ...moduleData,
                name: moduleData.name,
                widget: {
                    ...moduleData.widget,
                    name: moduleData.widget.name,
                },
            }}
            adjustable={false}
        >
            <Suspense
                fallback={<ModuleLoader $height={contentHeight} />} // 40px is the height of the header
            >
                <KasandraModule
                    isLoading={isLoadingCoinsData}
                    isLoadingHistory={isLoadingHistory}
                    isLoadingPredictions={isLoadingPredictions}
                    insights={insights || undefined}
                    selectedPredictions={predictions || undefined}
                    selectedMarketHistory={marketHistory}
                    selectedChartRange={selectedChartRange}
                    onSelectChartRange={handleSelectedChartRange}
                    selectedMarket={selectedMarket}
                    isAuthenticated={isAuthenticated}
                    onTogglePin={handleTogglePin}
                    pinnedCoins={pinnedCoins}
                    availableMarkets={coinsData}
                    onSelectMarket={handleSelectedMarket}
                    contentHeight={contentHeight}
                    selectedTimestamp={selectedTimestamp}
                    onSelectDataPoint={handleselectedTimestamp}
                />
            </Suspense>
        </BaseContainer>
    );
};

export default KasandraContainer;
