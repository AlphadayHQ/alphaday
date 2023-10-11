import { FC } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import { TLensPost } from "src/api/types";
import {
    URL_GLOBAL_REGEX,
    remarkRegex,
    REMARK_MENTION_REGEX,
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
} from "./LensFeedComponents";

const URL_REGEX = /([a-z\d-]+\.)+[a-z\d]{2,}[\w/?&=#%]*/g;

const PLUGINS = [
    remarkRegex(
        REMARK_MENTION_REGEX,
        (handle: string) => `https://lenster.xyz/u/${handle.slice(1)}`
    ),
    remarkRegex(
        REMARK_HASHTAG_REGEX,
        (handle: string) => `https://lenster.xyz/t/${handle.slice(1)}`
    ),
    remarkRegex(URL_GLOBAL_REGEX), // match all valid urls
    remarkRegex(URL_REGEX, (url: string) => `https://${url}`),
];

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const ALLOWED_AUDIO_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp4",
    "audio/aac",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
];

const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/webm",
    "video/quicktime",
];

const LensFeedItem: FC<TLensPost> = ({ tweet, url }) => {
    // eslint-disable-next-line no-underscore-dangle
    const postType = tweet.__typename;
    const profile =
        postType === "Mirror"
            ? tweet.mirrorOf?.profile || tweet.profile
            : tweet.profile;
    const profileUrl = `https://lenster.xyz/u/${tweet.profile.handle}`;

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
            <TweetColumn className="pt-[15px] w-[68px]">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    <AuthorImage
                        src={
                            profile.picture?.original?.url ??
                            profile.picture?.uri
                        }
                    />
                </a>
            </TweetColumn>
            <TweetColumn className="w-[80%]">
                {postType === "Mirror" && (
                    <div className="meta meta-sm">
                        <AuthorName
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meta-url"
                        >
                            <span className="meta">{tweet.profile.name}</span>
                        </AuthorName>{" "}
                        mirrored
                    </div>
                )}

                <div>
                    <AuthorName
                        href={`https://lenster.xyz/u/${profile.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-url"
                    >
                        {profile.name}{" "}
                        <span className="meta">
                            &#64;
                            {profile.handle} •{" "}
                            {moment(tweet.createdAt).fromNow()}
                        </span>
                    </AuthorName>
                </div>
                {postType === "Comment" && (
                    <div className="meta">
                        Replying to &#64;
                        {tweet.mainPost?.profile.handle}
                    </div>
                )}
                <TweetContent>
                    <ReactMarkdown remarkPlugins={PLUGINS}>
                        {tweet.metadata.content}
                    </ReactMarkdown>
                    {tweet.metadata.media?.length > 0 && (
                        <TweetAttachment>
                            {tweet.metadata.media.map((media, mediaIndex) => {
                                if (media.original.mimeType === null) {
                                    return null;
                                }
                                const isImage = ALLOWED_IMAGE_TYPES.includes(
                                    media.original.mimeType
                                );
                                const isVideo =
                                    ALLOWED_VIDEO_TYPES.includes(
                                        media.original.mimeType
                                    ) &&
                                    !media.original.url.includes("livepeer"); // TODO: Add support for livepeer videos
                                const isAudio = ALLOWED_AUDIO_TYPES.includes(
                                    media.original.mimeType
                                );
                                return (
                                    (isImage || isAudio || isVideo) && (
                                        <TweetMedia
                                            /**
                                             * In some cases, the media array contains the same image more than once.
                                             * It becomes difficult to uniquely identify the image in the array.
                                             *
                                             * As a result, although it is not recommended,
                                             * we are using the index of the image in the array build the key.
                                             */
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={`${media.original.url}${mediaIndex}`}
                                            data={media.original.url}
                                            ratio={
                                                isAudio || isVideo
                                                    ? 0
                                                    : undefined
                                            }
                                        />
                                    )
                                );
                            })}
                        </TweetAttachment>
                    )}
                </TweetContent>
            </TweetColumn>
        </TweetWrapper>
    );
};

export default LensFeedItem;
