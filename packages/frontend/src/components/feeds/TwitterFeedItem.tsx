import { FC } from "react";
import moment from "moment-with-locales-es6";
import ReactMarkdown from "react-markdown";
import { TSocialItem } from "src/api/services";
import { TTweets } from "src/api/types";
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
} from "./FeedComponents";

const X_MENTION_REGEX = /(@\w+)/g;
const URL_REGEX = /([a-z\d-]+\.)+[a-z\d]{2,}[\w/?&=#%]*/g;

const PLUGINS = [
    remarkRegex(X_MENTION_REGEX, (handle: string) => [
        `https://x.com/${handle.slice(1)}`,
        handle,
    ]),
    remarkRegex(REMARK_HASHTAG_REGEX, (handle: string) => [
        `https://x.com/hashtag/${handle.slice(1)}`,
        handle,
    ]),
    remarkRegex(URL_GLOBAL_REGEX),
    remarkRegex(URL_REGEX, (url: string) => [`https://${url}`, url]),
];

const TwitterFeedItem: FC<TSocialItem<TTweets>> = ({
    tweet,
    url,
    social_account,
}) => {
    const profileUrl = `https://x.com/${social_account.username}`;

    return (
        <TweetWrapper
            onClick={({ target }) => {
                if (!(target instanceof HTMLAnchorElement)) {
                    window.open(url, "_blank");
                }
            }}
        >
            <TweetColumn className="pt-1 w-[68px] items-center justify-start">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    <AuthorImage src={social_account.image ?? tweet.author.photoUrl} />
                </a>
            </TweetColumn>
            <TweetColumn className="w-[80%]">
                <div className="text-primaryVariant100 hover:text-primary">
                    <AuthorName
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        {tweet.author.name} &#64;
                        {social_account.username} •{" "}
                        {moment(tweet.createdAt).fromNow()}
                    </AuthorName>
                </div>
                <TweetContent>
                    <ReactMarkdown
                        remarkPlugins={PLUGINS}
                        className="[&_a]:text-secondaryOrange50 [&_a]:hover:underline break-word prose-p:mb-1"
                        linkTarget="_blank"
                    >
                        {tweet.text}
                    </ReactMarkdown>
                </TweetContent>
            </TweetColumn>
        </TweetWrapper>
    );
};

export default TwitterFeedItem;
