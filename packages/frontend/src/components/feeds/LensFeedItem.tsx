import { FC } from "react";
import moment from "moment";
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
    const profile = tweet.by.metadata;
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
                    {/* {postType === "Mirror" && (
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
                    )} */}

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
                    {/* {postType === "Comment" && <div>Replying to &#64;</div>} */}
                </div>
                <TweetContent>
                    <ReactMarkdown
                        remarkPlugins={PLUGINS}
                        className="[&_a]:text-primaryVariant100 [&_a:hover]:text-primary [&_a]:font-bold break-word"
                        linkTarget="_blank"
                    >
                        {tweet.metadata.content}
                    </ReactMarkdown>

                    {tweet.metadata.attachments?.length && (
                        <TweetAttachment>
                            {tweet.metadata.attachments?.map(
                                (media, mediaIndex) => {
                                    if (
                                        media.video &&
                                        !media.video.uri.includes("m3u8")
                                    ) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.video.uri}${mediaIndex}`}
                                                mediaType="video"
                                                src={media.video.uri}
                                            />
                                        );
                                    }

                                    if (media.audio) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.audio.uri}${mediaIndex}`}
                                                mediaType="audio"
                                                src={media.audio.uri}
                                            />
                                        );
                                    }

                                    if (media.image) {
                                        return (
                                            <TweetMedia
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${media.image.uri}${mediaIndex}`}
                                                mediaType="img"
                                                src={media.image.uri}
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
