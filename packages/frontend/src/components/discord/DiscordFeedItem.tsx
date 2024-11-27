import { FC, FormEvent, useState } from "react";
import { listItemVariants, HRElement } from "@alphaday/ui-kit";
import moment from "moment-with-locales-es6";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { TDiscordItem } from "src/api/types";
import { imgOnError, wideImgOnError } from "src/api/utils/errorHandling";
import {
    remarkRegex,
    URL_GLOBAL_REGEX,
    REMARK_MENTION_REGEX,
    REMARK_HASHTAG_REGEX,
} from "src/api/utils/textUtils";

interface IDiscordItem {
    item: TDiscordItem;
}

// regex to match time in discord message in format <t:unix_timestamp:R>
const TIME_REGEX = /<t:(\d+):R>/g;

const REMARK_PLUGINS = [
    remarkRegex(URL_GLOBAL_REGEX), // match all valid urls
    remarkRegex(TIME_REGEX, (time: string) => {
        const [, timestamp] = TIME_REGEX.exec(time) ?? [];
        if (!timestamp) {
            return time;
        }
        const date = new Date(parseInt(timestamp, 10) * 1000);
        return moment(date).format("h:mm A");
    }), // match all valid time strings
];

const TWITTER_REMARK_PLUGINS = [
    remarkRegex(REMARK_MENTION_REGEX, (handle: string) => [
        `https://twitter.com/${handle.slice(1)}`,
        handle,
    ]),
    remarkRegex(REMARK_HASHTAG_REGEX, (handle: string) => [
        `https://twitter.com/hashtag/${handle.slice(1)}`,
        handle,
    ]),
    ...REMARK_PLUGINS,
];

const MIN_CONTENT_LENGTH = 200;

const discordStyle = listItemVariants("discord");

const DiscordFeedItem: FC<IDiscordItem> = ({ item }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreview =
        item.content.slice(0, MIN_CONTENT_LENGTH) +
        (item.content.length > MIN_CONTENT_LENGTH ? "..." : "");
    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={(event: FormEvent) => {
                    if (
                        (event.target as HTMLDivElement).tagName === "A" ||
                        (event.target as HTMLDivElement).tagName === "IMG"
                    ) {
                        return;
                    }
                    open(item.href, "_blank");
                }}
                className={discordStyle.base}
            >
                <img
                    src={item.source.icon}
                    alt={item.source.name}
                    className={discordStyle.img}
                    onError={imgOnError}
                />
                <div className={discordStyle.info}>
                    <div className={discordStyle.title}>
                        {item.source.name}
                        <span className={discordStyle.spacer}>•</span>
                        <span className={discordStyle.date}>
                            {moment(item.timestamp).fromNow()}
                        </span>
                    </div>
                    {isExpanded ? (
                        <>
                            <ReactMarkdown
                                className={discordStyle.content}
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
                                                className={discordStyle.content}
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
                                                    className="w-full h-1/2 my-2 rounded"
                                                    onError={wideImgOnError}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        embed.thumbnail?.url && (
                                            <img
                                                src={embed.thumbnail.url}
                                                alt={embed.title}
                                                className="w-full h-1/2 my-2 rounded"
                                                onError={wideImgOnError}
                                            />
                                        )
                                    )}
                                </a>
                            ))}
                        </>
                    ) : (
                        <div className={discordStyle.content}>
                            {contentPreview}
                        </div>
                    )}
                    <div className={discordStyle.readMore}>
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsExpanded((prev) => !prev);
                            }}
                        >
                            {isExpanded
                                ? t("navigation.general.less")
                                : t("navigation.general.readMore")}
                        </span>
                    </div>
                </div>
            </div>
            <HRElement />
        </>
    );
};

export default DiscordFeedItem;
