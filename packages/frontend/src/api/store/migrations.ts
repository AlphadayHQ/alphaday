import { PersistedState } from "redux-persist";
import { Logger } from "../utils/logging";
import { RootState } from "./reducer";

type PersistedRootState = PersistedState & RootState;

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

type RootStateV100 = PersistedRootState;

export type TMigrationFunction = (
    state: Partial<PersistedRootState>
) => MaybeAsync<PersistedRootState>;

type TMigrations = {
    // 101: (s: RootStateV100) => PersistedRootState
    100: (s: PersistedState) => RootStateV100 | undefined;
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
export const addFieldToWidgetState = <
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
export const removeFieldFromState = <S extends Record<string, unknown>>(
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
    100: (s: PersistedState) => {
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
        if (version && version === 22) {
            Logger.debug("migrations: found version 22, preserving");
            return s as RootStateV100;
        }
        Logger.debug(
            `migrations: unexpected version ${version}, reseting state`
        );
        return undefined;
    },
};

export default migrations;
