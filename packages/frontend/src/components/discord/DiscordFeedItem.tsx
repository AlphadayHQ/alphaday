import { FC, FormEvent, useState } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import { TDiscordItem } from "src/api/types";
import { imgOnError } from "src/api/utils/errorHandling";
import {
    remarkRegex,
    URL_GLOBAL_REGEX,
    REMARK_MENTION_REGEX,
    REMARK_HASHTAG_REGEX,
} from "src/api/utils/textUtils";
import {
    StyledHr,
    StyledListItem,
} from "../widgets/listItem/AlphaListItem.style";

interface IDiscordItem {
    item: TDiscordItem;
}

const REMARK_PLUGINS = [
    remarkRegex(URL_GLOBAL_REGEX), // match all valid urls
];

const TWITTER_REMARK_PLUGINS = [
    remarkRegex(
        REMARK_MENTION_REGEX,
        (handle: string) => `https://twitter.com/${handle.slice(1)}`
    ),
    remarkRegex(
        REMARK_HASHTAG_REGEX,
        (handle: string) => `https://twitter.com/hashtag/${handle.slice(1)}`
    ),
    ...REMARK_PLUGINS,
];

const MIN_CONTENT_LENGTH = 200;

const DiscordFeedItem: FC<IDiscordItem> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreview =
        item.content.slice(0, MIN_CONTENT_LENGTH) +
        (item.content.length > MIN_CONTENT_LENGTH ? "..." : "");
    return (
        <>
            <StyledListItem
                type="discord"
                onClick={(event: FormEvent) => {
                    if (
                        (event.target as HTMLDivElement).tagName === "A" ||
                        (event.target as HTMLDivElement).tagName === "IMG"
                    ) {
                        return;
                    }
                    open(item.href, "_blank");
                }}
            >
                <img
                    src={item.source.icon}
                    alt={item.source.name}
                    className="img"
                    onError={imgOnError}
                />
                <div className="info">
                    <div className="title">
                        {item.source.name}
                        <span className="spacer">•</span>
                        <span className="date">
                            {moment(item.timestamp).fromNow()}
                        </span>
                    </div>
                    {isExpanded ? (
                        <>
                            <ReactMarkdown
                                className="content"
                                remarkPlugins={REMARK_PLUGINS}
                                linkTarget="_blank"
                            >
                                {item.content}
                            </ReactMarkdown>
                            {item.embeds.map((embed) => (
                                <a
                                    key={embed.url}
                                    href={embed.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {embed.type === "rich" ? (
                                        <>
                                            <ReactMarkdown
                                                className="content"
                                                remarkPlugins={
                                                    embed.url.indexOf(
                                                        "//twitter.com" // if this is a twitter embed, use twitter remark plugins
                                                    )
                                                        ? TWITTER_REMARK_PLUGINS
                                                        : REMARK_PLUGINS
                                                }
                                                linkTarget="_blank"
                                            >
                                                {embed.description}
                                            </ReactMarkdown>
                                            {embed.image && (
                                                <img
                                                    src={embed.image.url}
                                                    alt={embed.title}
                                                    className="embed"
                                                    onError={imgOnError}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <img
                                            src={embed.thumbnail.url}
                                            alt={embed.title}
                                            className="embed"
                                            onError={imgOnError}
                                        />
                                    )}
                                </a>
                            ))}
                        </>
                    ) : (
                        <div className="content">{contentPreview}</div>
                    )}
                    <div className="read-more">
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsExpanded((prev) => !prev);
                            }}
                        >
                            {isExpanded ? "Less" : "Read More"}
                        </span>
                    </div>
                </div>
            </StyledListItem>
            <StyledHr />
        </>
    );
};

export default DiscordFeedItem;
