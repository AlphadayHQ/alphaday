import { twitterFeedMock } from "src/mocks/twitter";
import {
    parseRemoteEntities,
    parseRemoteMedia,
    parseRemoteMetrics,
    parseRemoteUrl,
    parseRemoteUser,
} from "./twitterUtils";

const { tweet } = twitterFeedMock.results[0];

describe("parseRemoteUser", () => {
    it("should return a parsed user", () => {
        const expectedUser = tweet.author;
        const parsedUser = parseRemoteUser(expectedUser);

        expect(parsedUser.id).toBe(expectedUser.id);
        expect(parsedUser.name).toBe(expectedUser.name);
        expect(parsedUser.username).toBe(expectedUser.username);
        expect(parsedUser.bio).toBe(expectedUser.description);
        expect(parsedUser.photoUrl).toBe(expectedUser.profile_image_url);
        expect(parsedUser.verified).toBe(expectedUser.verified);
        expect(parsedUser.joinedAt).toBe(expectedUser.created_at);
        expect(parsedUser.metrics.followers).toBe(
            expectedUser.public_metrics.followers_count
        );
        expect(parsedUser.metrics.following).toBe(
            expectedUser.public_metrics.following_count
        );
        expect(parsedUser.metrics.tweets).toBe(
            expectedUser.public_metrics.tweet_count
        );
    });
});

describe("parseRemoteMedia", () => {
    it("should return a parsed media", () => {
        const [expectedMedia] =
            twitterFeedMock.results.filter(
                (t) => !!t.tweet.attachments?.attachments
            )?.[0]?.tweet.attachments?.attachments || [];
        expect(expectedMedia).toBeDefined();

        const parsedMedia = parseRemoteMedia(expectedMedia);

        if (!parsedMedia) {
            // This should never happen, but typescript doesn't know that
            expect(parsedMedia).toBeDefined();
            return;
        }

        expect(parsedMedia.id).toBe(expectedMedia.media_key);
        expect(parsedMedia.type).toBe(expectedMedia.type);
        expect(parsedMedia.width).toBe(expectedMedia.width);
        expect(parsedMedia.height).toBe(expectedMedia.height);
        expect(parsedMedia.views).toBe(
            expectedMedia.public_metrics?.view_count ?? 0
        );
        expect(parsedMedia.duration).toBe(expectedMedia.duration_ms);
        expect(parsedMedia.previewImageUrl).toBe(
            expectedMedia.preview_image_url
        );
    });
});

describe("parseRemoteUrl", () => {
    const [remoteUrl] =
        twitterFeedMock.results[0].tweet.author.entities?.url?.urls || [];
    const parsedUrl = parseRemoteUrl(remoteUrl);

    it("should parse remote urls", () => {
        expect(parsedUrl).toBeDefined();
        expect(parsedUrl.url).toBe(remoteUrl.url);
    });

    it("should hold parsed urls", () => {
        expect(parsedUrl.displayUrl).toBe(remoteUrl.display_url);
        expect(parsedUrl.expandedUrl).toBe(
            remoteUrl.unwound_url || remoteUrl.expanded_url
        );
        expect(parsedUrl.mediaKey).toBe(remoteUrl.media_key);
    });
});

describe("parseRemoteEntities", () => {
    const remoteEntity = twitterFeedMock.results[0].tweet.entities || {};
    const parsedEntity = parseRemoteEntities(remoteEntity);

    it("should return a parsed entity", () => {
        expect(parsedEntity).toBeDefined();
    });

    it("should copy remote entities", () => {
        expect(parsedEntity.hashtags).toBe(remoteEntity.hashtags);
        expect(parsedEntity.mentions).toBe(remoteEntity.mentions);
        expect(parsedEntity.cashtags).toBe(remoteEntity.cashtags);
    });

    it("should parse remote urls", () => {
        expect(parsedEntity.urls).toBeDefined();
        expect(parsedEntity.urls?.length).toBe(remoteEntity.urls?.length);

        const [remoteUrl] = remoteEntity.urls || [];
        const [parsedUrl] = parsedEntity.urls || [];
        expect(parsedUrl).toBeDefined();
        expect(parsedUrl.displayUrl).toEqual(remoteUrl.display_url);
    });
});

describe("parseRemoteMetrics", () => {
    const remoteMetrics = tweet.public_metrics;
    const parsedMetrics = parseRemoteMetrics(remoteMetrics);

    it("should parse metrics", () => {
        expect(remoteMetrics.like_count).toBe(parsedMetrics.likes);
        expect(remoteMetrics.quote_count).toBe(parsedMetrics.quotes);
        expect(remoteMetrics.reply_count).toBe(parsedMetrics.replies);
        expect(remoteMetrics.retweet_count).toBe(parsedMetrics.retweets);
    });
});
