/* eslint-disable no-underscore-dangle */
import { FC } from "react";
import moment from "moment-with-locales-es6";
import ReactMarkdown from "react-markdown";
import { TLensPost } from "src/api/types";
import {
    URL_GLOBAL_REGEX,
    remarkRegex,
    REMARK_HASHTAG_REGEX,
} from "src/api/utils/textUtils";
import {
    TweetColumn,
    AuthorImage,
    TweetWrapper,
    AuthorName,
    TweetContent,
    TweetAttachment,
    TweetMedia,
} from "./FeedComponents";

const URL_REGEX = /([a-z\d-]+\.)+[a-z\d]{2,}[\w/?&=#%]*/g;

const LENS_MENTION_REGEX = /(@[a-zA-Z\d-_]{1,31}.lens)/g;

const PLUGINS = [
    remarkRegex(LENS_MENTION_REGEX, (handle: string) => [
        `https://lenster.xyz/u/${handle.slice(1)}`,
        handle,
    ]),
    remarkRegex(REMARK_HASHTAG_REGEX, (handle: string) => [
        `https://lenster.xyz/t/${handle.slice(1)}`,
        handle,
    ]),
    remarkRegex(URL_GLOBAL_REGEX), // match all valid urls
    remarkRegex(URL_REGEX, (url: string) => [`https://${url}`, url]),
];

const LensFeedItem: FC<TLensPost> = ({ tweet, url, social_account }) => {
    const profile = (tweet.__typename === "Mirror" ? tweet.mirrorOn : tweet).by
        .metadata;
    const profileUrl = `https://hey.xyz/u/${social_account.username}`;

    return (
        <TweetWrapper
            onClick={({ target }) => {
                /**
                 * If the user clicks on a link, we do not want to open the feed in a new tab.
                 */
                if (!(target instanceof HTMLAnchorElement)) {
                    window.open(url, "_blank");
                }
            }}
        >
            <TweetColumn className="pt-1 w-[68px] items-center justify-start">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">{social_account.username}</span>
                    <AuthorImage
                        src={
                            profile.picture?.optimized?.uri ??
                            profile.picture?.raw.uri
                        }
                    />
                </a>
            </TweetColumn>
            <TweetColumn className="w-[80%]">
                <div className="text-primaryVariant100 hover:text-primary">
                    {tweet.__typename === "Mirror" && (
                        <div className="fontGroup-supportBold">
                            <AuthorName
                                href={profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fontGroup-supportBold"
                            >
                                {social_account.name}
                            </AuthorName>{" "}
                            mirrored
                        </div>
                    )}

                    <AuthorName
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        {profile.displayName} &#64;
                        {social_account.username} •{" "}
                        {moment(tweet.createdAt).fromNow()}
                    </AuthorName>
                </div>
                <TweetContent>
                    <div className="[&_a]:text-secondaryOrange50 [&_a]:hover:underline break-word prose-p:mb-1">
                        <ReactMarkdown remarkPlugins={PLUGINS}>
                            {tweet.metadata.content}
                        </ReactMarkdown>
                    </div>

                    {Number(tweet.metadata.attachments?.length) > 0 && (
                        <TweetAttachment>
                            {tweet.metadata.attachments?.map(
                                (media, mediaIndex) => {
                                    if (
                                        media.video &&
                                        !media.video.optimized.uri.includes(
                                            "m3u8"
                                        )
                                    ) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.video.optimized.uri}${mediaIndex}`}
                                                mediaType="video"
                                                src={media.video.optimized.uri}
                                            />
                                        );
                                    }

                                    if (media.audio) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.audio.optimized.uri}${mediaIndex}`}
                                                mediaType="audio"
                                                src={media.audio.optimized.uri}
                                            />
                                        );
                                    }

                                    if (media.image) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.image.optimized.uri}${mediaIndex}`}
                                                mediaType="img"
                                                src={media.image.optimized.uri}
                                                alt={media.altTag}
                                            />
                                        );
                                    }
                                    return null;
                                }
                            )}
                        </TweetAttachment>
                    )}
                </TweetContent>
            </TweetColumn>
        </TweetWrapper>
    );
};

export default LensFeedItem;
