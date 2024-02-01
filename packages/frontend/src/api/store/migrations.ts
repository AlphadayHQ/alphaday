import { PersistedState, MigrationManifest } from "redux-persist";
import { EWidgetSettingsRegistry } from "src/constants";
import { TRemoteTagReadOnly, TRemoteUserViewWidget } from "../services";
import {
    EAuthState,
    TCachedView,
    TUserView,
    WalletConnectionState,
} from "../types";
import { Logger } from "../utils/logging";
import { RootState } from "./reducer";
import { IViewsState } from "./slices/views";

type PersistedRootState = (PersistedState & RootState) | undefined;

/**
 * RootState variants
 * Historic note: Alphaday's frontend v0.x (ie. the legacy repo) last storage
 * version was 21. (You should find this in src/config/config.ts)
 * This repo (v2) starts with storage version 100 and does not include legacy
 * migrations, which means storage will be reset for all existing users.
 */

/**
 * when storage gets modified to v101 or greater, RootStateV100 should be re-defined
 * as something like:
 *   type RootStatev100 = Omit<PersistedRootState, "new added field in v101">.
 * The corresponding migration function should take the form:
 *   101: (s: RootStateV100) => PersistedRootState
 * Similarly, when storage gets to v102, we'll need to redefine RootStatev100, eg:
 *   type RootStatev100 = Omit<RootStatev101, "new added field in v101">
 * and
 *   type RootStatev101 = Omit<PersistedRootState, "new added field in v102">
 * The new  migration function should look like:
 *   102: (s: RootStateV101) => PersistedRootState
 */

type RootStateV103 = PersistedRootState;

type RootStateV102 =
    | (PersistedRootState &
          Omit<RootState, "user"> & {
              user: Omit<RootState["user"], "auth"> & {
                  auth: Omit<RootState["user"]["auth"], "access">;
              };
          })
    | undefined;

type RootStateV101 = RootStateV100;

type TCachedViewV100 = Omit<TCachedView, "data"> & {
    data: Omit<TUserView, "widgets"> & {
        widgets: Omit<TRemoteUserViewWidget, "settings"> &
            {
                settings: {
                    setting: {
                        name: string;
                        slug: EWidgetSettingsRegistry;
                        setting_type: string;
                    };
                    tags: TRemoteTagReadOnly[];
                    toggle_value: boolean | null;
                }[];
            }[];
    };
};

type RootStateV100 =
    | (PersistedState &
          (Omit<RootState, "views"> & {
              views: Omit<IViewsState, "viewsCache" | "sharedViewsCache"> & {
                  viewsCache: Record<number, TCachedViewV100> | undefined;
                  sharedViewsCache: Record<number, TCachedViewV100> | undefined;
              };
          }))
    | undefined;

type TMigrations = MigrationManifest & {
    100: (s: PersistedState) => RootStateV100;
    101: (s: RootStateV100) => RootStateV101;
    102: (s: RootStateV101) => RootStateV102;
    103: (s: RootStateV102) => RootStateV103;
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
// @ts-expect-error
const migrations: TMigrations = {
    100: (s): RootStateV100 => {
        // eslint-disable-next-line no-underscore-dangle
        const version = s?._persist?.version;
        // v21 was last storage version in legacy repo
        // we'll reset state for versions older than that
        if (version && version < 21) {
            Logger.warn(
                `Found old storage version ${version}, resetting state`
            );
            return undefined;
        }
        if (version && version === 21) {
            Logger.debug("migrations: found version 21, preserving");
            return s as RootStateV100;
        }
        Logger.warn(
            `migrations: unexpected version ${version}, reseting state`
        );
        return undefined;
    },
    101: (s: RootStateV100): RootStateV101 => {
        /**
         * this migration is needed because widgets using format_structure
         * were migrated (on the BE DB) to use custom_data.
         * The FE storage migration is needed to ensure the widgets are correctly updated
         */
        if (!s) return undefined;
        return {
            ...s,
            views: {
                selectedViewId: undefined,
                prevSelectedViewId: undefined,
                viewsCache: undefined,
                sharedViewsCache: undefined,
                subscribedViewsCache: undefined,
            },
        };
    },
    102: (s: RootStateV101): RootStateV102 => {
        /**
         * Remove view state because widget settings have been
         */
        if (!s) return undefined;
        try {
            return {
                ...s,
                views: {
                    ...s.views,
                    viewsCache: undefined,
                    sharedViewsCache: undefined,
                },
            };
        } catch (e) {
            Logger.error("migrations::102: Migration failed", e);
            return undefined;
        }
    },
    103: (s: RootStateV102): RootStateV103 => {
        // add new access state
        if (!s) return undefined;
        try {
            return {
                ...s,
                user: {
                    ...s.user,
                    auth: {
                        token: undefined,
                        access: {
                            status: EAuthState.Guest,
                            method: undefined,
                            error: null,
                        },
                        wallet: {
                            account: undefined,
                            status: WalletConnectionState.Disconnected,
                            error: null,
                            method: undefined,
                        },
                    },
                },
                // reset views state since users will need to auth again
                views: {
                    ...s.views,
                    prevSelectedViewId: undefined,
                    viewsCache: undefined,
                    sharedViewsCache: undefined,
                    subscribedViewsCache: undefined,
                },
            };
        } catch (e) {
            Logger.error("migrations::103: Migration failed", e);
            return undefined;
        }
    },
};

export default migrations;
