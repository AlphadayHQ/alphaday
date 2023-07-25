
declare global {
    export type MaybeAsync<T> = T | Promise<T>;
    /**
     * RequireAtLeastOne, is used to enforce a condition on a type T such that at least one of the properties in T is required.
     * 
     * RequireAtLeastOne<T, Keys extends keyof T = keyof T> takes two type parameters, T and Keys. T is any type, while Keys is a set of keys from T.
     * By default, Keys extends from keyof T, which means it includes all keys of T.
     *
     * Pick<T, Exclude<keyof T, Keys>>: This takes all the properties of T that are not in Keys and leaves them unchanged.
     *
     * {[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;}[Keys]: This ensures that for each key in Keys,
     * at least one of them is required (Required<Pick<T, K>>), and the rest are optional (Partial<Pick<T, Exclude<Keys, K>>>).
     */
    export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
        T,
        Exclude<keyof T, Keys>
    > &
        {
            [K in Keys]-?: Required<Pick<T, K>> &
                Partial<Pick<T, Exclude<Keys, K>>>;
        }[Keys];
}
