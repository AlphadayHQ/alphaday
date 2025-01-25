import { renderHook } from "@testing-library/react";
import { useSendActivityLogMutation } from "src/api/services";
import {
    EActivityLogEventTypes,
    EActivityLogObjectTypes,
} from "src/api/services/activity-log/types";
import {
    ECookieChoice,
    EFeedItemType,
    EWalletConnectionMethod,
    TSuperfeedItem,
} from "src/api/types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { Logger } from "../utils/logging";
import { useActivityLogger } from "./useActivityLogger";

vi.mock("src/api/services", () => ({
    useSendActivityLogMutation: vi.fn(),
}));

vi.mock("../utils/logging", () => ({
    Logger: {
        debug: vi.fn(),
        error: vi.fn(),
    },
}));

export const createMockSuperfeedItem = (override = {}) => {
    const defaultItem: TSuperfeedItem = {
        // Base item properties
        id: 1,
        title: "Mock Superfeed Item",
        url: "https://example.com/mock-item",
        sourceIcon: "https://example.com/source-icon.png",
        sourceSlug: "mock-source",
        sourceName: "Mock Source",

        // Superfeed specific properties
        itemId: 1001,
        trendiness: 0.75,
        type: EFeedItemType.BLOG,
        date: "2024-01-25T12:00:00Z",
        startsAt: null,
        endsAt: null,
        image: "https://example.com/mock-image.jpg",
        shortDescription: "This is a mock superfeed item description",
        tags: [
            { name: "Mock Tag 1", slug: "mock-tag-1" },
            { name: "Mock Tag 2", slug: "mock-tag-2" },
        ],
        likes: 42,
        isLiked: false,
        comments: 10,
        fileUrl: null,
        duration: null,
        data: null,
    };

    return {
        ...defaultItem,
        ...override,
    };
};

describe("useActivityLogger", () => {
    const mockSendActivityLog = vi.fn();
    const mockUnwrap = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUnwrap.mockResolvedValue({ success: true });
        mockSendActivityLog.mockReturnValue({ unwrap: () => mockUnwrap() });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useSendActivityLogMutation as any).mockReturnValue([
            mockSendActivityLog,
        ]);
    });

    test("logViewVisited sends correct payload and handles success", () => {
        const { result } = renderHook(() => useActivityLogger());
        const viewId = 123;

        result.current.logViewVisited(viewId);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.ViewVisited,
            object_type: 3,
            object_id: viewId,
        });
    });

    test("logCookieChoice sends correct payload and handles success", () => {
        const { result } = renderHook(() => useActivityLogger());
        const choice = ECookieChoice.AcceptAll;

        result.current.logCookieChoice(choice);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.CookieChoiceSet,
            data: { choice },
        });
    });

    test("logKeywordSelected sends correct payload and handles success", () => {
        const { result } = renderHook(() => useActivityLogger());
        const keywordId = 456;

        result.current.logKeywordSelected(keywordId);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.KeywordSelected,
            object_id: keywordId,
            object_type: EActivityLogObjectTypes.Keyword,
        });
    });

    test("logWalletConnection sends correct payload and handles success", () => {
        const { result } = renderHook(() => useActivityLogger());
        const method = EWalletConnectionMethod.Metamask;

        result.current.logWalletConnection(method);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.WalletConnection,
            object_type: EActivityLogObjectTypes.WalletConnection,
            data: { method },
        });
    });

    test("logShareSuperfeedItem sends correct payload and handles success", () => {
        const { result } = renderHook(() => useActivityLogger());
        const mockItem = createMockSuperfeedItem({
            id: 789,
            title: "Test Title",
            shortDescription: "Test Description",
            url: "https://test.com",
        });

        result.current.logShareSuperfeedItem(mockItem);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.ShareSuperfeedItem,
            object_type: EActivityLogObjectTypes.ShareSuperfeedItem,
            object_id: mockItem.id,
            data: {
                title: mockItem.title,
                text: mockItem.shortDescription,
                url: mockItem.url,
            },
        });
    });

    test("handles API errors correctly", () => {
        const { result } = renderHook(() => useActivityLogger());
        const error = new Error("API Error");
        mockUnwrap.mockRejectedValue(error);

        const { logViewVisited } = result.current;
        logViewVisited(123);

        return new Promise<void>((resolve) => {
            setImmediate(() => {
                expect(Logger.error).toHaveBeenCalled();
                expect(Logger.debug).not.toHaveBeenCalled();
                resolve();
            });
        });
    });

    test("uses title as text when shortDescription is missing", () => {
        const { result } = renderHook(() => useActivityLogger());
        const mockItem = createMockSuperfeedItem({
            id: 789,
            title: "Test Title",
            shortDescription: "Test Description",
            url: "https://test.com",
        });

        result.current.logShareSuperfeedItem(mockItem);

        expect(mockSendActivityLog).toHaveBeenCalledWith({
            event_type: EActivityLogEventTypes.ShareSuperfeedItem,
            object_type: EActivityLogObjectTypes.ShareSuperfeedItem,
            object_id: mockItem.id,
            data: {
                title: mockItem.title,
                text: mockItem.title,
                url: mockItem.url,
            },
        });
    });

    test("multiple logging calls work independently", () => {
        const { result } = renderHook(() => useActivityLogger());
        const viewId = 123;
        const keywordId = 456;

        result.current.logViewVisited(viewId);
        result.current.logKeywordSelected(keywordId);

        expect(mockSendActivityLog).toHaveBeenCalledTimes(2);
        expect(mockSendActivityLog).toHaveBeenNthCalledWith(1, {
            event_type: EActivityLogEventTypes.ViewVisited,
            object_type: 3,
            object_id: viewId,
        });
        expect(mockSendActivityLog).toHaveBeenNthCalledWith(2, {
            event_type: EActivityLogEventTypes.KeywordSelected,
            object_id: keywordId,
            object_type: EActivityLogObjectTypes.Keyword,
        });
    });
});
