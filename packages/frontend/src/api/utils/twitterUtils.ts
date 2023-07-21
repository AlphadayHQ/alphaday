import {
    TGetTweetsRawResponseV1,
    TRemoteTweet,
    TRemoteTweetEntities,
    TRemoteTweetMedia,
    TRemoteTweetMetrics,
    TRemoteTweetUrl,
    TRemoteTweetUser,
    TRemoteTweetV1,
} from "../services";
import {
    TTweets,
    TTweetAttachment,
    TTweetAuthor,
    TTweetEntities,
    TTweetMetric,
    TTweetUrl,
} from "../types";

export const parseRemoteUser = (
    twitterUser: TRemoteTweetUser
): TTweetAuthor => {
    return {
        id: twitterUser.id,
        name: twitterUser.name,
        username: twitterUser.username,
        bio: twitterUser.description,
        photoUrl: twitterUser.profile_image_url,
        verified: twitterUser.verified,
        metrics: {
            tweets: twitterUser.public_metrics.tweet_count,
            followers: twitterUser.public_metrics.followers_count,
            following: twitterUser.public_metrics.following_count,
        },
        joinedAt: twitterUser.created_at,
    };
};

export const parseRemoteMedia = (
    remoteMedia: TRemoteTweetMedia
): TTweetAttachment => {
    return {
        id: remoteMedia.media_key,
        type: remoteMedia.type,
        width: remoteMedia.width,
        height: remoteMedia.height,
        views: remoteMedia.public_metrics?.view_count || 0,
        duration: remoteMedia.duration_ms,
        previewImageUrl: remoteMedia.preview_image_url,
        url: remoteMedia.url,
    };
};

export const parseRemoteUrl = ({
    display_url,
    expanded_url,
    unwound_url,
    media_key,
    ...rest
}: TRemoteTweetUrl): TTweetUrl => ({
    displayUrl: display_url,
    expandedUrl: unwound_url || expanded_url,
    mediaKey: media_key,
    ...rest,
});

export const parseRemoteEntities = ({
    urls,
    hashtags,
    cashtags,
    mentions,
}: TRemoteTweetEntities): TTweetEntities => ({
    hashtags,
    cashtags,
    mentions,
    urls: urls?.map(parseRemoteUrl),
});

export const parseRemoteMetrics = ({
    retweet_count,
    reply_count,
    like_count,
    quote_count,
}: TRemoteTweetMetrics): TTweetMetric => ({
    retweets: retweet_count,
    replies: reply_count,
    likes: like_count,
    quotes: quote_count,
});

export const parseAsTweet = (remoteTweet: TRemoteTweet): TTweets => {
    const author = parseRemoteUser(remoteTweet.author);
    const referencedTweets = remoteTweet.referenced_tweets?.map((ref) => ({
        id: ref.id,
        type: ref.type,
        tweet: ref.tweet ? parseAsTweet(ref.tweet) : undefined,
    }));

    return {
        id: remoteTweet.id,
        text: remoteTweet.text,
        source: remoteTweet.source,
        sensitive: remoteTweet.possibly_sensitive,
        author,
        entities: remoteTweet.entities
            ? parseRemoteEntities(remoteTweet.entities)
            : undefined,
        attachments: remoteTweet?.attachments?.attachments.map(
            parseRemoteMedia
        ),
        referencedTweets: remoteTweet.referenced_tweets,
        retweet: referencedTweets?.[0].tweet,
        metrics: parseRemoteMetrics(remoteTweet.public_metrics),
        createdAt: remoteTweet.created_at,
        lang: remoteTweet.lang,
    };
};

export const parseRemoteTweetV1 = (
    t: TRemoteTweetV1,
    r: TGetTweetsRawResponseV1
): TRemoteTweet => {
    return {
        ...t,
        attachments: {
            media_keys: t.attachments?.media_keys ?? [],
            attachments:
                r.includes.media?.filter((m) =>
                    t.attachments?.media_keys?.includes(m.media_key)
                ) ?? [],
        },
        author: r.includes.users.find(
            (u) => u.id === t.author_id
        ) as TRemoteTweetUser,
    };
};
