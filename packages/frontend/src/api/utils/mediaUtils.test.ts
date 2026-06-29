import { describe, it, expect } from "vitest";
import {
    getYoutubeVideoId,
    getVideoEmbedUrl,
    isYoutubeShortUrl,
    parseAspectRatio,
    resolveVideoAspect,
} from "./mediaUtils";

describe("getYoutubeVideoId", () => {
    it("extracts the id from a watch URL", () => {
        expect(
            getYoutubeVideoId("https://www.youtube.com/watch?v=abc123")
        ).toBe("abc123");
    });
    it("extracts the id from a shorts URL", () => {
        expect(getYoutubeVideoId("https://www.youtube.com/shorts/abc123")).toBe(
            "abc123"
        );
    });
    it("extracts the id from a youtu.be URL", () => {
        expect(getYoutubeVideoId("https://youtu.be/abc123")).toBe("abc123");
    });
    it("extracts the id from an embed URL", () => {
        expect(getYoutubeVideoId("https://www.youtube.com/embed/abc123")).toBe(
            "abc123"
        );
    });
    it("ignores extra query params on a shorts URL", () => {
        expect(
            getYoutubeVideoId("https://www.youtube.com/shorts/abc123?feature=x")
        ).toBe("abc123");
    });
    it("returns null for an empty url", () => {
        expect(getYoutubeVideoId("")).toBeNull();
    });
    it("returns null for a non-YouTube host", () => {
        expect(getYoutubeVideoId("https://vimeo.com/12345")).toBeNull();
    });
    it("returns null for a watch URL without a `v` param", () => {
        expect(getYoutubeVideoId("https://www.youtube.com/watch")).toBeNull();
    });
});

describe("getVideoEmbedUrl", () => {
    it("builds an embed URL for a shorts link", () => {
        expect(
            getVideoEmbedUrl("https://www.youtube.com/shorts/abc123", {
                autoplay: 1,
            })
        ).toBe("//www.youtube.com/embed/abc123?autoplay=1");
    });
    it("builds an embed URL for a watch link", () => {
        expect(
            getVideoEmbedUrl("https://www.youtube.com/watch?v=abc123", {
                autoplay: 1,
            })
        ).toBe("//www.youtube.com/embed/abc123?autoplay=1");
    });
    it("passes through a non-YouTube URL unchanged", () => {
        const url = "https://vimeo.com/12345";
        expect(getVideoEmbedUrl(url, { autoplay: 1 })).toBe(url);
    });
});

describe("isYoutubeShortUrl", () => {
    it("detects shorts URLs", () => {
        expect(isYoutubeShortUrl("https://www.youtube.com/shorts/abc123")).toBe(
            true
        );
    });
    it("returns false for regular watch URLs", () => {
        expect(
            isYoutubeShortUrl("https://www.youtube.com/watch?v=abc123")
        ).toBe(false);
    });
});

describe("parseAspectRatio", () => {
    it("returns undefined when absent", () => {
        expect(parseAspectRatio(undefined)).toBeUndefined();
    });
    it("passes through a positive float", () => {
        expect(parseAspectRatio(0.5625)).toBe(0.5625);
    });
    it("rejects a non-positive float", () => {
        expect(parseAspectRatio(0)).toBeUndefined();
    });
    it('parses a "W:H" string', () => {
        expect(parseAspectRatio("9:16")).toBeCloseTo(9 / 16);
    });
    it("parses a numeric string", () => {
        expect(parseAspectRatio("1.7778")).toBeCloseTo(1.7778);
    });
    it("returns undefined for garbage", () => {
        expect(parseAspectRatio("not-a-ratio")).toBeUndefined();
    });
});

describe("resolveVideoAspect", () => {
    it("prefers the backend aspect ratio over the URL", () => {
        const result = resolveVideoAspect({
            url: "https://www.youtube.com/watch?v=abc123",
            aspectRatio: "9:16",
        });
        expect(result.isVertical).toBe(true);
        expect(result.ratio).toBeCloseTo(9 / 16);
    });
    it("falls back to the shorts URL heuristic", () => {
        const result = resolveVideoAspect({
            url: "https://www.youtube.com/shorts/abc123",
        });
        expect(result.isVertical).toBe(true);
    });
    it("defaults to landscape", () => {
        const result = resolveVideoAspect({
            url: "https://www.youtube.com/watch?v=abc123",
        });
        expect(result.isVertical).toBe(false);
        expect(result.ratio).toBeCloseTo(16 / 9);
    });
});
