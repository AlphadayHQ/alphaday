import migrations from "./migrations";
import { RootState } from "./reducer";

/**
 * Performs a migration against a stored version and the previous/current state
 *
 * @param version - The version to bump to
 * @param prevState - application state may change throughout its lifetime. Thus this is unknown
 * @returns the modified state object
 */
const runMigration = (version: number, prevState: unknown) => {
    return migrations[version](prevState as RootState);
};

const stateV5 = {
    search: {
        lastSelectedKeyword: undefined,
    },
    ui: {
        theme: "dark",
        showOnboarding: false,
        showWidgetLib: false,
        selectedDate: "2022-09-02T15:33:33.582Z",
        showBalance: true,
        eventFilters: [
            {
                value: "Co",
                label: "Conference",
                category: "Conferences",
                color: "rgb(185, 225, 135)",
            },
            {
                value: "MU",
                label: "Meetup",
                category: "Meetups",
                color: "rgb(117, 71, 247)",
            },
        ],
        minimisedWidgets: [],
        showTutorial: false,
        cookieChoice: 2,
    },
    user: {
        auth: {
            token: {
                value: "1db81afdb371431f069b4f1f121130f004688ffa",
            },
            wallet: {
                account: {
                    address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
                },
                status: 5,
                error: null,
            },
        },
        portfolioAccounts: [
            {
                id: 2,
                address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
            },
        ],
        selectedPortfolioAccount: {
            address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        },
        settings: {},
    },
    views: {
        selectedViewId: undefined,
        prevSelectedViewId: 248,
        // set to empty to minimise data
        viewsCache: {},
    },
    widgets: {
        market: {
            ed56c535a7bafad1c1cc7b6ac97f9a47: {
                selectedMarket: {
                    name: "Cardano",
                    slug: "cardano",
                    ticker: "ADA",
                    icon:
                        "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
                    tags: [177],
                },
            },
            "98f4fd2e4be702765ffa5e9e29821f6e": {
                selectedMarket: {
                    name: "Polkadot",
                    slug: "polkadot-new",
                    ticker: "DOT",
                    icon:
                        "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
                    tags: [142],
                },
            },
        },
    },
};

// v5 without widget customizations
const stateV5Variant1 = {
    search: {
        lastSelectedKeyword: undefined,
    },
    ui: {
        theme: "dark",
        showOnboarding: false,
        showWidgetLib: false,
        selectedDate: "2022-09-02T15:33:33.582Z",
        showBalance: true,
        eventFilters: [
            {
                value: "Co",
                label: "Conference",
                category: "Conferences",
                color: "rgb(185, 225, 135)",
            },
            {
                value: "MU",
                label: "Meetup",
                category: "Meetups",
                color: "rgb(117, 71, 247)",
            },
        ],
        minimisedWidgets: [],
        showTutorial: false,
        cookieChoice: 2,
    },
    user: {
        auth: {
            token: {
                value: "1db81afdb371431f069b4f1f121130f004688ffa",
            },
            wallet: {
                account: {
                    address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
                },
                status: 5,
                error: null,
            },
        },
        portfolioAccounts: [
            {
                id: 2,
                address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
            },
        ],
        selectedPortfolioAccount: {
            address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        },
        settings: {},
    },
    views: {
        selectedViewId: undefined,
        prevSelectedViewId: 248,
        // set to empty to minimise data
        viewsCache: {},
    },
    widgets: {
        market: undefined,
    },
};

const stateV7 = {
    search: {
        lastSelectedKeyword: undefined,
    },
    ui: {
        theme: "dark",
        showOnboarding: true,
        showWidgetLib: false,
        showBalance: true,
        showTutorial: false,
        cookieChoice: undefined,
    },
    user: {
        auth: {
            token: {
                value: "1db81afdb371431f069b4f1f121130f004688ffa",
            },
            wallet: {
                account: {
                    address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
                },
                status: 5,
                error: null,
            },
        },
        portfolioAccounts: [
            {
                id: 2,
                address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
            },
        ],
        selectedPortfolioAccount: {
            address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        },
        settings: {},
    },
    views: {
        selectedViewId: undefined,
        prevSelectedViewId: 248,
        // set to empty to minimise data
        viewsCache: {},
    },
    widgets: {
        common: {},
        market: {},
        news: {},
        portfolio: {},
        calendar: {},
    },
};
const stateV12 = {
    search: {
        lastSelectedKeyword: undefined,
    },
    ui: {
        theme: "dark",
        showOnboarding: true,
        showWidgetLib: false,
        showBalance: true,
        showTutorial: false,
        cookieChoice: undefined,
    },
    user: {
        auth: {
            token: {
                value: "1db81afdb371431f069b4f1f121130f004688ffa",
            },
            wallet: {
                account: {
                    address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
                },
                status: 5,
                error: null,
            },
        },
        portfolioAccounts: [
            {
                id: 2,
                address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
            },
        ],
        selectedPortfolioAccount: {
            address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
        },
        settings: {},
    },
    views: {
        selectedViewId: undefined,
        prevSelectedViewId: 248,
        // set to empty to minimise data
        viewsCache: {},
    },
    widgets: {
        common: {
            d542fa5c3d4d14d13e79e731292fef69: {
                isMinimised: false,
            },
            "98f4fd2e4be702765ffa5e9e29821f6e": {
                isMinimised: false,
            },
        },
        market: {
            "98f4fd2e4be702765ffa5e9e29821f6e": {
                selectedChartType: "candlestick",
                selectedChartRange: "1W",
                selectedMarket: {
                    name: "BNB",
                    slug: "bnb",
                    ticker: "BNB",
                    icon:
                        "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
                    tags: [92, 1684, 1627],
                },
            },
        },

        news: {},
        portfolio: {},
        calendar: {},
        podcast: {},
        video: {},
        blog: {},
    },
};
describe("migrations", () => {
    test("version 6", async () => {
        const stateV6 = await runMigration(6, stateV5);

        // @ts-expect-error cleaned up
        expect(stateV6.ui.selectedDate).toBe(undefined);
        // @ts-expect-error cleaned up
        expect(stateV6.ui.eventFilters).toBe(undefined);
        // @ts-expect-error cleaned up
        expect(stateV6.ui.minimisedWidgets).toBe(undefined);

        expect(stateV6.widgets.market).toEqual(stateV5.widgets.market);
        // @ts-expect-error this value does not exist in state
        expect(stateV6.widgets.portfolio).not.toBe(undefined);
        // @ts-expect-error this value does not exist in state
        expect(stateV6.widgets.calendar).not.toBe(undefined);
        // @ts-expect-error this value does not exist in state
        expect(stateV6.widgets.common).not.toBe(undefined);

        expect(() => runMigration(6, stateV5Variant1)).not.toThrow();
    });

    test("version 8", async () => {
        const stateV8 = await runMigration(8, stateV7);

        expect("showTutorial" in stateV8.ui).toBe(false);
        // Reassign prev showTutorial state
        expect(stateV8.ui.tutorial.showTutorial).toEqual(
            stateV5.ui.showTutorial
        );
        expect("currentTutorialTip" in stateV8.ui.tutorial).toBe(true);
        expect(stateV8.ui.tutorial.currentTutorialTip).toBe(undefined);
    });
    test("version 13", async () => {
        const stateV13 = await runMigration(13, stateV12);
        expect(
            stateV13.widgets.market["98f4fd2e4be702765ffa5e9e29821f6e"]
                .selectedChartRange
        ).toEqual(
            stateV12.widgets.market["98f4fd2e4be702765ffa5e9e29821f6e"]
                .selectedChartRange
        );
        expect(
            stateV13.widgets.market["98f4fd2e4be702765ffa5e9e29821f6e"]
                .selectedChartType
        ).toBe("candlestick");
    });
});
