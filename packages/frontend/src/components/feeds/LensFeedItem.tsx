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
            <TweetColumn className="pt-1 w-[68px] items-center justify-start">
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
                <div className="text-primaryVariant100 hover:text-primary">
                    {postType === "Mirror" && (
                        <div className="fontGroup-supportBold">
                            <AuthorName
                                href={profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fontGroup-supportBold"
                            >
                                {tweet.profile.name}
                            </AuthorName>{" "}
                            mirrored
                        </div>
                    )}

                    <AuthorName
                        href={`https://lenster.xyz/u/${profile.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        {profile.name} &#64;
                        {profile.handle} • {moment(tweet.createdAt).fromNow()}
                    </AuthorName>
                    {postType === "Comment" && (
                        <div>
                            Replying to &#64;
                            {tweet.mainPost?.profile.handle}
                        </div>
                    )}
                </div>
                <TweetContent>
                    <ReactMarkdown
                        remarkPlugins={PLUGINS}
                        className="[&_a]:text-primaryVariant100 [&_a:hover]:text-primary [&_a]:font-bold break-word"
                        linkTarget="_blank"
                    >
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
                                const audioVideoType = isAudio
                                    ? "audio"
                                    : "video";
                                const mediaType = isImage
                                    ? "img"
                                    : audioVideoType;
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
                                            src={media.original.url}
                                            mediaType={mediaType}
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
