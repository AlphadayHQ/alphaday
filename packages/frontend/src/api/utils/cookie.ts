export function checkCookie(): boolean {
    let { cookieEnabled } = navigator;
    if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    }
    return cookieEnabled;
}
