/* eslint-disable @typescript-eslint/no-unsafe-return */

import React, { lazy } from "react";
import { Logger } from "./logging";

// eslint-disable-next-line
export const isObject = (param: any): boolean =>
    param != null && typeof param === "object" && !Array.isArray(param);

// eslint-disable-next-line
export const isEmptyObj = (param: any): boolean =>
    // eslint-disable-next-line
    isObject(param) && Object.keys(param).length === 0;

// eslint-disable-next-line
export const isString = (s: any): boolean =>
    typeof s === "string" || s instanceof String;

// eslint-disable-next-line
export const isNumber = (n: string): boolean =>
    !isNaN(parseFloat(n)) && isFinite(parseFloat(n));

export function minVal(items: number[][]): number[] {
    return items.reduce(
        (acc, val) => {
            // eslint-disable-next-line no-param-reassign
            acc[0] = val[1] < acc[0] ? val[1] : acc[0];
            return acc;
        },
        [1e10]
    );
}

export const isHash: (s: string | undefined | null) => boolean = (s) => {
    if (s == null) return false;
    const HASH_REGEX = /^[abcdef0-9]{32}$/;
    return HASH_REGEX.test(s);
};

/**
 * takes an array of objects containing a numeric id and returns a dictionary
 * in the form:
 * {
 *   id1: elem1,
 *   id2: elem2,
 *   ...
 * }
 */
export const arrayAsDictById = <T extends { id: number }>(
    arr: T[]
): Record<number, T> => {
    return arr.reduce(
        (acc, newVal) => {
            // eslint-disable-next-line no-param-reassign
            acc[newVal.id] = newVal;
            return acc;
        },
        {} as Record<number, T>
    );
};

export const delay = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

// Ignores any concurrent calls to this function
// and instead instantly resolves with null
export const ignoreConcurrentAsync = <T, R>(
    handler: (arg: T) => Promise<R>,
    additionalDelay?: number
): ((arg: T) => Promise<R | null | undefined>) => {
    let inProgress = false;
    return async (...args) => {
        if (inProgress) return null;
        inProgress = true;
        try {
            return await handler(...args);
        } finally {
            // note: don't await on purpose
            delay(additionalDelay || 0)
                .then(() => {
                    inProgress = false;
                })
                .catch((_e) => {
                    // do nothing
                });
        }
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends any[]>(
    fn: (...args: T) => void,
    waitTimeout = 1
) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), waitTimeout);
    };
};

/** Key used to store the refresh value in sessionStorage */
const REFRESH_KEY = "retry-lazy-refresh-key";

/**
 * A wrapper around React.lazy that will retry the import if it fails
 * by refreshing the page. This is useful for when the user is on a
 * cached version of the app and the server has been updated.
 *
 * @param componentImport an import function that returns a promise
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyRetry = <T extends React.FC<any>>(
    componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
    return lazy<T>(
        () =>
            new Promise((resolve, reject) => {
                const hasRefreshed: boolean = JSON.parse(
                    sessionStorage.getItem(REFRESH_KEY) || "false"
                );
                componentImport()
                    .then((component) => {
                        sessionStorage.setItem(REFRESH_KEY, "false");
                        resolve(component);
                    })
                    .catch((error) => {
                        if (!hasRefreshed) {
                            sessionStorage.setItem(REFRESH_KEY, "true");
                            location.reload();
                        } else {
                            sessionStorage.setItem(REFRESH_KEY, "false"); // reset the value back to false
                            Logger.error(
                                "lazyRetry::failed to load component",
                                error
                            );
                            reject(error);
                        }
                    });
            })
    );
};

/**
 * @returns true if the app is running as a PWA
 */
export const isPWA = () => {
    const isIosPWA = window.matchMedia("(display-mode: standalone)").matches;
    return (
        isIosPWA ||
        ("standalone" in window.navigator && !!window.navigator.standalone)
    );
};

/**
 * @returns true if the current device is a mobile device
 */
export const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // User agent checks for various mobile devices
    if (/android/i.test(userAgent)) {
        return true;
    }

    // @ts-ignore - TS doesn't know about MSStream
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }

    return false;
};
