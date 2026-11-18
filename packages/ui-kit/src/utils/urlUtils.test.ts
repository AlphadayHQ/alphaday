/* eslint-disable no-script-url -- these tests feed javascript: URLs to the sanitizer on purpose */
import { afterEach, describe, expect, it, vi } from "vitest";
import { openInNewTab, safeUrl } from "./urlUtils";

describe("safeUrl", () => {
    it.each([
        "https://alphaday.com/path?q=1",
        "http://example.com",
        "mailto:hello@example.com",
        "/relative/path",
        "#anchor",
        "//cdn.example.com/x",
    ])("allows %s", (url) => {
        expect(safeUrl(url)).toBe(url);
    });

    it.each([
        "javascript:alert(1)",
        "JavaScript:alert(1)",
        " javascript:alert(1)",
        "java\tscript:alert(1)",
        "java\nscript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "vbscript:msgbox(1)",
        "",
        "   ",
    ])("rejects %j", (url) => {
        expect(safeUrl(url)).toBeUndefined();
    });

    it.each([undefined, null, 42, {}])("rejects non-string %j", (url) => {
        expect(safeUrl(url)).toBeUndefined();
    });
});

describe("openInNewTab", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("opens safe URLs with noopener", () => {
        const open = vi.spyOn(window, "open").mockReturnValue(null);
        openInNewTab("https://example.com");
        expect(open).toHaveBeenCalledWith(
            "https://example.com",
            "_blank",
            "noopener,noreferrer"
        );
    });

    it("does nothing for unsafe URLs", () => {
        const open = vi.spyOn(window, "open").mockReturnValue(null);
        openInNewTab("javascript:alert(1)");
        openInNewTab(undefined);
        expect(open).not.toHaveBeenCalled();
    });
});
