import { MigrationManifest } from "redux-persist";
// @ts-ignore this type does not exist yet // TODO
import { EChartType } from "src/components/market/types";
import { Logger } from "../utils/logging";
import { RootState } from "./reducer";

/**
 * RootState variants
 */

type RootStateV5 = Omit<RootState, "ui" | "widgets"> & {
    ui: RootState["ui"] & {
        selectedDate?: string;
        eventFilters?: string[];
        minimisedWidgets?: string[];
    };
    widgets: Pick<RootState["widgets"], "market">;
};

type RootStateV6 = Omit<RootStateV5, "widgets"> & {
    widgets: RootStateV5["widgets"] &
        Pick<RootState["widgets"], "portfolio" | "calendar" | "common">;
};

type RootStateV7 = Omit<RootStateV6, "ui" | "widgets"> & {
    ui: RootStateV6["ui"] & {
        showTutorial?: boolean;
    };
    widgets: RootStateV6["widgets"] & Pick<RootState["widgets"], "news">;
};

type RootStateV8 = Omit<RootStateV7, "ui"> & {
    ui: RootState["ui"];
};

/**
 * Migration specific types
 */

export type TMigrationStateVariant =
    | RootStateV5
    | RootStateV6
    | RootStateV7
    | RootStateV8;

export type TMigrationFunction<T, U = T, V = unknown> = (
    state: V extends unknown ? RootState : T
) => MaybeAsync<U>;

export type TMigrations = MigrationManifest & {
    [key: number]: TMigrationFunction<TMigrationStateVariant>;
};

/**
 * State of widgets is typically kept in the form:
 * someWidgetState = {
 *     [widgetInstanceHash]: {
 *         ...
 *     }
 * }
 * This function adds a new key-value to every instance of a given widget.
 * @param state The current widget state (for all widget instances)
 * @param newKey
 * @param defaultValue
 * @returns a new widget state with the field added to each widget
 */
const addFieldToWidgetState = <
    S extends Record<string, unknown>,
    K extends keyof S[string],
>(
    state: S,
    newKey: K,
    defaultValue: S[string][typeof newKey]
): typeof state => {
    const res: Record<string, unknown> = {};

    Object.keys(state).forEach((widgetHash) => {
        res[widgetHash] = {
            ...(state[widgetHash] ?? {}),
            [newKey]: defaultValue,
        };
    });
    return res as S;
};

/**
 * We should never have to cleanup state again. But just in case,
 * This handler should remove an unwanted state value from the store.
 *
 * @param state
 * @param fieldKey
 */
const removeFieldFromState = <S extends Record<string, unknown>>(
    state: S,
    fieldKey: string
): S => {
    // remove the key from the object as well as read it's value
    const { [fieldKey]: value, ...cleanedState } = state;
    // we should know what has been removed to properly handle edge cases
    Logger.debug(
        "migrations::removeFieldFromState, successfully removed field:value",
        fieldKey,
        value
    );
    return cleanedState as S;
};

/**
 * The app's state is persisted in local storage. When the app is updated,
 * the persisted state is migrated to the new version. This is done by
 * applying the latest migrations to the persisted state.
 *
 * The migrations are applied in order, starting from the persisted state
 * and ending with the latest version of the state.
 *
 * This is an example of a migration function:
 * ```ts
 * 19: (state): RootState => {
 *    return {
 *       ...state,
 *      ui: {
 *         ...state.ui,
 *        acceptedSwapToS: undefined,
 *     },
 *  };
 * },
 * ```
 * A few things to note:
 * - The migration function takes the persisted state as input and returns
 *  the migrated state.
 * - The migration function is applied to the persisted state in order.
 * - The expected type of the persisted state should be defined in the
 * TMigrationStateVariant type.
 */
const migrations: TMigrations = {
    20: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                common: removeFieldFromState(
                    state.widgets.common,
                    "widgetHeight"
                ),
                podcast: removeFieldFromState(
                    state.widgets.podcast,
                    "preferredChannelIds"
                ),
                video: removeFieldFromState(
                    state.widgets.video,
                    "preferredChannelIds"
                ),
            },
        };
    },
    19: (state): RootState => {
        return {
            ...state,
            ui: {
                ...state.ui,
                acceptedSwapToS: undefined,
            },
        };
    },
    18: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                common: addFieldToWidgetState(
                    state.widgets.common,
                    "widgetHeight",
                    undefined
                ),
            },
        };
    },
    17: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                podcast: addFieldToWidgetState(
                    state.widgets.podcast,
                    "preferredChannelIds",
                    []
                ),
                video: addFieldToWidgetState(
                    state.widgets.video,
                    "preferredChannelIds",
                    []
                ),
            },
        };
    },
    16: (state): RootState => {
        return {
            ...state,
            views: {
                ...state.views,
                viewsCache: undefined,
                sharedViewsCache: undefined,
                subscribedViewsCache: undefined,
            },
        };
    },
    15: (state): RootState => {
        return {
            ...state,
            views: {
                ...state.views,
                subscribedViewsCache: undefined,
            },
        };
    },
    14: (state): RootState => {
        return {
            ...state,
            ui: {
                ...state.ui,
                mobile: {
                    widgetsNavOpen: false,
                    selectedMobileSortOrder: 0,
                },
            },
        };
    },
    13: (state) => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                market: {
                    // eslint-disable-next-line
                    ...(Object.keys(state.widgets.market).length !== 0 &&
                        addFieldToWidgetState(
                            // eslint-disable-next-line
                            state.widgets.market,
                            "selectedChartType",
                            EChartType.Candlestick
                        )),
                },
            },
        };
    },
    // layout system was changed and a new sort_order field is now expected
    // for every view widget.
    // For simplicity, we just reset views in cache
    // @ts-expect-error we're resetting the views in cache
    12: (state) => {
        return {
            ...state,
            views: {},
        };
    },
    11: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                blog: {},
            },
        };
    },
    10: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                video: {},
            },
        };
    },
    9: (state): RootState => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                podcast: {},
            },
        };
    },
    8: (state: RootStateV7): RootStateV8 => {
        const { showTutorial, ...uiState } = state.ui;
        return {
            ...state,
            ui: {
                ...uiState,
                tutorial: {
                    showTutorial,
                    currentTutorialTip: undefined,
                },
            },
        };
    },
    7: (state: RootStateV6): RootStateV7 => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                news: {},
            },
        };
    },
    6: (state: RootStateV5): RootStateV6 => {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            selectedDate,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            eventFilters,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            minimisedWidgets,
            ...uiState
        } = state.ui;
        return {
            ...state,
            ui: uiState,
            widgets: {
                market: {
                    ...(state.widgets.market || {}),
                },
                portfolio: {},
                calendar: {},
                common: {},
            },
        };
    },
    5: (state) => {
        return {
            ...state,
            ui: {
                ...state.ui,
                cookieChoice: undefined,
            },
            views: {
                ...state.views,
            },
        };
    },
    4: (state) => {
        return {
            ...state,
            user: {
                ...state.user,
                settings: {
                    cookieChoice: undefined,
                },
            },
        };
    },
};

export default migrations;
