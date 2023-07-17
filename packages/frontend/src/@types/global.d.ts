export {};

declare global {
    export type MaybeAsync<T> = T | Promise<T>;
}
