/**
 * `isCookieEnabled` checks if the current user has disabled browser cookies or not.
 */
export function isCookieEnabled(): boolean {
    let { cookieEnabled } = navigator;
    if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    }
    return cookieEnabled;
}
