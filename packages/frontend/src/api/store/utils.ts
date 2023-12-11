import { Logger } from "../utils/logging";

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
        "store::utils:removeFieldFromState, successfully removed field:value",
        fieldKey,
        value
    );
    return cleanedState as S;
};
