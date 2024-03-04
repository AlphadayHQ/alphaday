/**
 * Checks if the current environment supports the Web Share API.
 *
 * @returns Returns true if the Web Share API is supported, otherwise false.
 */
export function canShare() {
    return navigator.share !== undefined && navigator.canShare !== undefined;
}

/**
 * Shares the provided data using the Web Share API if it is supported by the browser.
 *
 * @param data - The data to be shared.
 */
export function shareData(data: ShareData) {
    if (canShare() && navigator.canShare(data)) {
        return navigator.share(data);
    }
    return Promise.reject(new Error("Sharing not supported"));
}
