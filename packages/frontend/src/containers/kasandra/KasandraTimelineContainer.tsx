import { FC, useState, useEffect, useRef, useCallback } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import {
    TBaseTag,
    useBookmarkNewsItemMutation,
    useOpenNewsItemMutation,
} from "src/api/services";
import {
    setKasandraFeedPreference,
    selectKasandraFeedPreference,
    setKasandraSelectedDataPoint,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TKasandraItem, EItemFeedPreference } from "src/api/types";
import * as filterUtils from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import KasandraTimelineModule from "src/components/kasandra/KasandraTimelineModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const mockItemsResponse: {
    links: {
        next: string | null;
        previous: string | null;
    };
    total: number;
    results: TKasandraItem[];
} = {
    links: {
        next: "https://api.zettaday.com/items/news/?page=2&tags=",
        previous: null,
    },
    total: 196570,
    results: [
        {
            id: 197241,
            title: "Bitcoin Bull Run Isn’t Over: Cathie Wood Predicts $1.5 Million",
            url: "https://www.newsbtc.com/news/bitcoin/bitcoin-bull-run-cathie-wood-1-5-million/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/newsbtc_news.jpg",
            sourceSlug: "newsbtc_news",
            sourceName: "NewsBTC",
            author: "Jake Simmons",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741164660348, 87851.52480429214],
        },
        {
            id: 197099,
            title: "BFI charity allocates $90M, pledges $200M for health, climate initiatives",
            url: "https://cointelegraph.com/news/polygon-cofounder-sandeep-nailwal-bfi-crypto-donations-2024?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cointelegraph_news.jpg",
            sourceSlug: "cointelegraph_news",
            sourceName: "Cointelegraph",
            author: "Cointelegraph by Lyne Qian",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741170107310, 88585.41702795791],
        },
        {
            id: 197180,
            title: "Polygon co-founder donates over $90m to healthcare through BFI",
            url: "https://crypto.news/embargo-19th-march-2025-530pm-ist-8am-et-polygon-co-founder-donates-over-90m-to-healthcare-through-bfi/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Trisha Husada",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,
            direction: "down",
            dataPoint: [1741178438708, 90642.95015625951],
        },
        {
            id: 197260,
            title: "Crypto Wallet Provider Utila Raises $18M as Institutional Demand for Digital Asset Management Soars",
            url: "https://www.coindesk.com/business/2025/03/19/crypto-wallet-provider-utila-raises-usd18m-as-institutional-demand-for-digital-asset-management-soars",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Krisztian Sandor",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,
            direction: "down",
            dataPoint: [1741187721785, 88645.80293266727],
        },
        {
            id: 197118,
            title: "EOS Experiences 25% Spike Following Vaulta Rebranding Announcement",
            url: "https://cryptopotato.com/eos-experiences-25-spike-following-vaulta-rebranding-announcement/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptopotato_news.png",
            sourceSlug: "cryptopotato_news",
            sourceName: "CryptoPotato",
            author: "Chayanika Deka",
            publishedAt: "2025-03-19T11:59:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741194993156, 89200.38695874772],
        },
        {
            id: 197119,
            title: "Very Important Pi Network (PI) Update: Here’s What You Need to Know",
            url: "https://cryptopotato.com/very-important-pi-network-pi-update-heres-what-you-need-to-know/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptopotato_news.png",
            sourceSlug: "cryptopotato_news",
            sourceName: "CryptoPotato",
            author: "Dimitar Dzhondzhorov",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741213299449, 93150.48615154381],
        },
        {
            id: 197280,
            title: "機関投資家にXRPが人気｜調査対象の34%が保有か",
            url: "https://crypto-times.jp/news-coinbase-report-xrp/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/Crypto_times.png",
            sourceSlug: "cryptotimes_news",
            sourceName: "CryptoTimes",
            author: "Crypto Times 編集部",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741224991917, 95360.60531197047],
        },
        {
            id: 197255,
            title: "North Carolina’s new Bitcoin bill could allocate $950M from estimated general fund to BTC",
            url: "https://cryptobriefing.com/north-carolina-bitcoin-reserve-bill/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptobriefing.jpg",
            sourceSlug: "cryptobriefing_news",
            sourceName: "CryptoBriefing",
            author: "Vivian Nguyen",
            publishedAt: "2025-03-20T23:49:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741233957824, 96775.07080936989],
        },
        {
            id: 197201,
            title: "Top Memecoins To Invest In Right Now",
            url: "https://cryptodaily.co.uk/2025/03/top-memecoins-to-invest-in-right-now",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/Crypto_Daily_w4XrX0d.png",
            sourceSlug: "cryptodaily_news",
            sourceName: "CryptoDaily",
            author: "Ethan Caldwell",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741239404177, 97496.58285405449],
        },
        {
            id: 197166,
            title: "Hollywood director arrested on charges of swindling $11 million from Netflix to invest in stocks and crypto",
            url: "https://www.theblock.co/post/347017/hollywood-filmmaker-arrested-charged-alleged-11-million-usd-fraud-trade-cryptocurrencies?utm_source=rss&utm_medium=rss",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/images-removebg-preview.png",
            sourceSlug: "theblock_news",
            sourceName: "The Block",
            author: "James Hunt",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,
            direction: "down",
            dataPoint: [1741213299449, 90150.48615154381],
        },
        {
            id: 197181,
            title: "HIVE Digital completes acquisition of Paraguay’s Yguazú site, seeks 317% mining boost",
            url: "https://crypto.news/hive-digital-completes-acquisition-of-paraguays-yguazu-site-seeks-317-mining-boost/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Denis Omelchenko",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741224991917, 90360.60531197047],
        },
        {
            id: 197182,
            title: "Ethereum to discontinue support for Holesky testnet in September",
            url: "https://crypto.news/ethereum-to-discontinue-support-for-holesky-testnet-in-september/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Darya Nassedkina",
            publishedAt: "2025-03-20T23:49:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741233957824, 91775.07080936989],
        },
        {
            id: 197183,
            title: "Memecoins will end up ‘worthless,’ says ARK Invest CEO",
            url: "https://crypto.news/memecoins-will-end-up-worthless-says-ark-invest-ceo/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Trisha Husada",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741239404177, 92496.58285405449],
        },
        {
            id: 197261,
            title: "Erdogan Rival's Arrest Sends Lira to Record Low, Bitcoin-TRY Volume Surging on Binance",
            url: "https://www.coindesk.com/markets/2025/03/19/turkish-lira-crashes-to-record-low-spurring-volume-surge-in-binance-s-bitcoin-lira-pair",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Omkar Godbole",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741213299449, 87150.48615154381],
        },
        {
            id: 197262,
            title: "Crypto Daybook Americas: Memecoins Take Off on Tron While Bitcoin Looks to FOMC",
            url: "https://www.coindesk.com/daybook-us/2025/03/19/crypto-daybook-americas-memecoins-take-off-on-tron-while-bitcoin-looks-to-fomc",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Francisco Rodrigues, Shaurya Malwa",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741224991917, 85360.60531197047],
        },
        {
            id: 197148,
            title: "UNDER EXPOSED EP17 - Macro, Relief Rally and Crypto’s Political Divide",
            url: "https://decrypt.co/videos/interviews/y2rR8zoQ/under-exposed-ep17-macro-relief-rally-and-cryptos-political-divide",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/decrypt_news.jpg",
            sourceSlug: "decrypt_news",
            sourceName: "Decrypt",
            author: "",
            publishedAt: "2025-03-20T22:49:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741230378341, 86833.40344858613],
        },
        {
            id: 197100,
            title: "AI and crypto drive criminal efficiency: Europol",
            url: "https://cointelegraph.com/news/europol-ai-crypto-organized-crime-threat-report?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cointelegraph_news.jpg",
            sourceSlug: "cointelegraph_news",
            sourceName: "Cointelegraph",
            author: "Cointelegraph by Ezra Reguerra",
            publishedAt: "2025-03-21T01:49:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741234857155, 86689.96098257162],
        },
        {
            id: 197149,
            title: "‘Notcoin’ Studio Expands From Telegram Tapping to ‘Not Games’ Platform",
            url: "https://decrypt.co/310578/notcoin-expands-telegram-not-games-platform",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/decrypt_news.jpg",
            sourceSlug: "decrypt_news",
            sourceName: "Decrypt",
            author: "Andrew Hayward",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,
            direction: "up",
            dataPoint: [1741239404177, 85496.58285405449],
        },
    ],
};

const widgetConfig = CONFIG.WIDGETS.KASANDRA_PREDICTIONS;
const KasandraTimelineContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const selectedDataPoint = useAppSelector(
        (state) => state.widgets.kasandra?.[moduleData.hash]?.selectedDataPoint
    );

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const defaultFeed = widgetConfig.DEFAULT_FEED_PREFERENCE;

    const feedPreference =
        useAppSelector(selectKasandraFeedPreference(moduleData.hash)) ??
        defaultFeed;

    const setFeedPreference = useCallback(
        (preference: EItemFeedPreference) => {
            dispatch(
                setKasandraFeedPreference({
                    widgetHash: moduleData.hash,
                    preference,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const [items, setItems] = useState<TKasandraItem[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();

    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const pollingInterval =
        (moduleData.widget.refresh_interval || widgetConfig.POLLING_INTERVAL) *
        1000;

    const queryParameters = {
        page: currentPage,
        tags: tags ? filterUtils.filteringListToStr(tags) : undefined,
        feedPreference,
    };

    // TODO(xavier-charles): refactor to use the new api
    // const {
    //     currentData: itemsData,
    //     isLoading,
    //     isSuccess,
    // } = useGetNewsListQuery(queryParameters, {
    //     pollingInterval,
    // });

    const itemsData = mockItemsResponse;
    const isLoading = false;
    const isSuccess = true;

    console.log("itemsData", itemsData);
    const [openItemMut] = useOpenNewsItemMutation();
    const [bookmarkItemMut] = useBookmarkNewsItemMutation();

    const onOpenItem = async (id: number) => {
        if (openItemMut !== undefined) {
            await openItemMut({
                id,
            });
        }
    };

    const onBookmarkItem = useCallback(
        (item: TKasandraItem) => {
            if (bookmarkItemMut !== undefined) {
                if (!isAuthenticated) {
                    toast(
                        globalMessages.callToAction.signUpToBookmark("items")
                    );
                    return;
                }
                bookmarkItemMut({ item })
                    .unwrap()
                    .then(() => {
                        toast("Your preference has been saved successfully.");
                        /**
                         * When a user bookmarks an item, we need to update the list of items
                         * to reflect the change. We do this by updating the list of items
                         */
                        setItems((prevItems) => {
                            if (!prevItems) {
                                /**
                                 * Prev items should never be undefined, but we need to handle this case
                                 */
                                Logger.error(
                                    "KasandraTimelineContainer::onBookmarkNewsItem: prevItems is undefined, this should not happen for news",
                                    item.id
                                );
                                return prevItems;
                            }
                            /**
                             * If the current feedPreference is not bookmarked items, then we need to toggle its bookmark status
                             * else we need to remove it from the list
                             */
                            if (
                                feedPreference !== EItemFeedPreference.Bookmark
                            ) {
                                const bookmarkPos = prevItems.indexOf(item);
                                if (bookmarkPos === -1) {
                                    /**
                                     * Bookmarked item should be in the list of items, but we need to handle this case
                                     */
                                    Logger.error(
                                        "KasandraTimelineContainer::onBookmarkNewsItem: news item is not in prevItems, this should not happen for news",
                                        item.id
                                    );
                                    return prevItems;
                                }
                                const newItems = [...prevItems];
                                newItems[bookmarkPos] = {
                                    ...item,
                                    bookmarked: !item.bookmarked,
                                };
                                return newItems;
                            }
                            // removing from the list ensures bookmarked items only are shown in the list
                            return prevItems.filter((i) => i.id !== item.id);
                        });
                    })
                    .catch(() =>
                        toast(
                            "We could not save your preference. Please try again"
                        )
                    );
            }
        },
        [bookmarkItemMut, feedPreference, isAuthenticated]
    );

    const handleSelectedDataPoint = useCallback(
        (dataPoint: [number, number]) => {
            dispatch(
                setKasandraSelectedDataPoint({
                    widgetHash: moduleData.hash,
                    dataPoint,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    // reset results when tags preferences changed
    useEffect(() => {
        /**
         * To ensure that the items are not duplicated, we need to check if the
         * new tags are different from the previous ones. If they are, we need to
         * reset the items and the current page.
         *
         * We use a ref to store the previous tags, because we don't want to
         * trigger a re-render when the tags change. And assigning a default
         * value when tagsRef.current is undefined ensures that the first
         * comparison will always be true.
         */
        if (tags && !itemListsAreEqual(tagsRef.current || [], tags)) {
            setItems(undefined);
            setCurrentPage(undefined);
        }
        tagsRef.current = tags;
    }, [tags]);

    useEffect(() => {
        if (
            !isAuthenticated &&
            feedPreference === EItemFeedPreference.Bookmark
        ) {
            setFeedPreference(EItemFeedPreference.Last);
        }
        // we do not want to track `setFeedPreference`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedPreference, isAuthenticated]);

    // reset results when feed preference changes
    useEffect(() => {
        setItems(undefined);
        setCurrentPage(undefined);
    }, [feedPreference]);

    useEffect(() => {
        const data = itemsData?.results;
        if (data !== undefined) {
            setItems((prevItems) => {
                if (prevItems) {
                    const newItems = buildUniqueItemList([
                        ...prevItems,
                        ...data,
                    ]);

                    return newItems;
                }
                return data;
            });
        }
    }, [itemsData?.results]);

    const { nextPage, handleNextPage } = usePagination(
        itemsData?.links,
        widgetConfig.MAX_PAGE_NUMBER,
        isSuccess
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
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

    if (feedPreference !== undefined) {
        return (
            <KasandraTimelineModule
                isLoadingItems={isLoading}
                // we default items to newsData?.results to avoid a flickering/infinite loading
                items={
                    (items || itemsData?.results) as TKasandraItem[] | undefined
                }
                handlePaginate={handleNextPage}
                feedPreference={feedPreference}
                onSetFeedPreference={setFeedPreference}
                widgetHeight={widgetHeight}
                onClick={onOpenItem}
                onBookmark={onBookmarkItem}
                isAuthenticated={isAuthenticated}
                selectedDataPoint={selectedDataPoint}
                onSelectDataPoint={handleSelectedDataPoint}
            />
        );
    }
    return null;
};

export default KasandraTimelineContainer;
