import { FC } from "react";
import { ReactComponent as PauseSVG } from "src/assets/svg/pause.svg";
import { ReactComponent as PlaySVG } from "src/assets/svg/play2.svg";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import ItemBookmark from "./ItemBookmark";
import styles from "./ListItem.module.scss";

export const HRElement = () => (
    <hr className="border-borderLine m-0 ml-2 mr-[3px]" />
);

interface IList {
    variant: "news" | "dao" | "podcast" | "video" | "reports" | "discord";
    path?: string;
    duration: string;
    title: string;
    description?: string;
    source?: string;
    tag?: string;
    tagImg?: string;
    mediaLength?: string;
    bookmarked?: boolean;
    onClick?: () => MaybeAsync<void>;
    onBookmark?: () => MaybeAsync<void>;
    isAuthenticated?: boolean;
    isPlaying?: boolean;
    image?: string;
}

export const listItemVariants = (variant: IList["variant"]) => {
    const defaults = {
        base: twMerge(
            styles.listItem,
            "flex relative flex-row items-start py-3 px-1 ml-2 mr-[3px] bg-background hover:bg-backgroundVariant100 active:bg-backgroundVariant200"
        ),
        info: "grow-[1]",
        date: "fontGroup-mini min-w-[50px] text-primaryVariant100 mr-[5px]",
        title: "fontGroup-highlight text-primary self-stretch grow-0 flex items-center mb-0",
        content:
            "content prose-h2:fontGroup-highlightSemi prose-h4:fontGroup-highlightSemi prose-h6:fontGroup-highlightSemi prose-h1:fontGroup-highlightSemi prose-h3:fontGroup-highlightSemi prose-h5:fontGroup-highlightSemi break-word m-0 text-primary [&>p>a]:text-secondaryOrange50 [&>p>a]:hover:underline",
        readMore:
            "fontGroup-highlightSemi flex justify-end text-primaryVariant100",
        lastLine: "lastLine fontGroup-mini flex text-primaryVariant100 mt-2",
        spacer: "mx-[7px] my-0 self-center",
        bookmark: "block cursor-pointer mt-px",
        img: "w-4 h-4 mr-[5px] rounded-[100px]",
    };
    const variants = {
        news: { ...defaults, date: twMerge(defaults.date, "pt-[1.5px]") },
        dao: {
            ...defaults,
            img: twMerge(
                defaults.img,
                "w-[38px] h-[38px] mr-3.5 rounded-[100px]"
            ),
            date: twMerge(defaults.date, "fontGroup-mini"),
        },
        discord: {
            ...defaults,
            base: twMerge(defaults.base, "cursor-pointer bg-background"),
            img: twMerge(
                defaults.img,
                "w-[38px] h-[38px] mr-3.5 rounded-[100px]"
            ),
        },
        podcast: {
            ...defaults,
            base: twMerge(
                defaults.base,
                "podcast flex-col bg-[color:var(--background)] cursor-pointer py-4 px-2 rounded-none"
            ),
            img: twMerge(
                defaults.img,
                "w-[30px] h-[30px] mr-3.5 mr-3.5 rounded-none"
            ),
            date: twMerge(defaults.date, "fontGroup-normal"),
        },
        video: {
            ...defaults,
            base: twMerge(
                defaults.base,
                "video bg-background cursor-pointer py-4 px-2 rounded-none"
            ),
            date: twMerge(
                defaults.date,
                "fontGroup-mini min-w-min m-0 whitespace-nowrap self-center"
            ),
            bookmark: twMerge(defaults.bookmark, "self-center"),
            lastLine: twMerge(defaults.lastLine, "center absolute bottom-4"),
        },
        reports: { ...defaults, date: twMerge(defaults.date, "pt-[1.5px]") },
    };

    return variants[variant];
};

// note external liks have to begin with http:// or https://
export const ListItem: FC<IList> = ({
    variant,
    path,
    duration,
    title,
    source,
    tag,
    tagImg,
    bookmarked,
    description,
    onClick,
    mediaLength,
    onBookmark,
    isAuthenticated,
    isPlaying,
    image,
}) => {
    if (variant === "news") {
        const variantStyle = listItemVariants("news");

        return (
            <>
                <a
                    href={path}
                    target="_blank"
                    onClick={onClick}
                    className={variantStyle.base}
                    rel="noreferrer"
                >
                    <div className={variantStyle.date}>{duration}</div>
                    <div className={variantStyle.info}>
                        <div className={variantStyle.title}>{title}</div>
                        <p className={variantStyle.lastLine}>
                            {source}
                            {source && (
                                <span className={variantStyle.spacer}>•</span>
                            )}
                            <img
                                src={tagImg}
                                alt=""
                                className={variantStyle.img}
                                onError={imgOnError}
                            />
                            <span>{tag}</span>{" "}
                            <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={onBookmark}
                                bookmarked={bookmarked}
                            />
                        </p>
                    </div>
                </a>
                <HRElement />
            </>
        );
    }

    // TODO (xavier-charles):: remove this if we no longer need it
    if (variant === "reports") {
        const variantStyle = listItemVariants("reports");
        return (
            <>
                <li className={variantStyle.base}>
                    <div className={variantStyle.date}>{duration}</div>
                    <div className={variantStyle.info}>
                        <div className={variantStyle.title}>
                            <a
                                type={variant}
                                href={path}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {title}
                            </a>
                        </div>
                        <p className={variantStyle.lastLine}>
                            {tag && (
                                <>
                                    <a
                                        href={tagImg}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span>{tag}</span>{" "}
                                    </a>
                                    <span className={variantStyle.spacer}>
                                        •
                                    </span>
                                </>
                            )}

                            <img
                                src={source}
                                alt=""
                                className={variantStyle.img}
                                onError={imgOnError}
                            />
                            <span className="capitalize">{source}</span>
                        </p>
                    </div>
                </li>
                <HRElement />
            </>
        );
    }

    if (variant === "podcast") {
        const variantStyle = listItemVariants("podcast");

        return (
            <>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    className={variantStyle.base}
                >
                    <div className="flex flex-row">
                        <img
                            src={tagImg}
                            alt=""
                            className={variantStyle.img}
                            onError={imgOnError}
                        />
                        <div className="grow-[1]">
                            <p className="fontGroup-support mb-0">{tag}</p>
                            <p className="fontGroup-mini text-primaryVariant100">
                                {duration}
                            </p>
                        </div>
                    </div>
                    <div className="mt-[7px]">
                        <p className={variantStyle.title}>{title}</p>
                        <p className="mt-[3px]">{description}</p>
                    </div>
                    <p
                        className={twMerge(
                            variantStyle.lastLine,
                            "lastLine center"
                        )}
                    >
                        <span
                            className={twMerge(
                                "fontGroup-normal border-primaryVariant200 bg-backgroundVariant100 text-primary flex h-[23px] w-[77px] flex-row items-center justify-center rounded-lg border border-solid pb-[3px] pl-1.5 pr-2.5 pt-0.5",
                                styles.audioIndicator,
                                isPlaying &&
                                    "bg-secondaryOrange text-backgroundBlue"
                            )}
                        >
                            {isPlaying ? (
                                <PauseSVG className="w-[16.4px]" />
                            ) : (
                                <PlaySVG className=" fill-primaryVariant100 mr-[5.4px] w-[9px]" />
                            )}
                            <span className="length">{mediaLength}</span>
                        </span>
                        <ItemBookmark
                            isAuthenticated={isAuthenticated}
                            onBookmark={onBookmark}
                            bookmarked={bookmarked}
                            className="self-center"
                        />
                    </p>
                </div>
                <HRElement />
            </>
        );
    }
    if (variant === "video") {
        const variantStyle = listItemVariants("video");
        return (
            <>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    className={variantStyle.base}
                >
                    <img
                        src={image}
                        alt=""
                        className="min-w-[100px] two-col:min-w-[142.22px] h-20 object-cover rounded-none"
                        onError={imgOnError}
                    />
                    <div className="ml-[10px] flex flex-col justify-between h-[initial]">
                        <p
                            className={twMerge(
                                variantStyle.title,
                                "line-clamp-3"
                            )}
                        >
                            {title}
                        </p>

                        <p className={variantStyle.lastLine}>
                            <span className="line-clamp-1 max-w-[90px] sm:max-w-max">
                                {tag}
                            </span>
                            <span className={variantStyle.spacer}>•</span>
                            <span className={variantStyle.date}>
                                {duration}
                            </span>
                            <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={onBookmark}
                                bookmarked={bookmarked}
                                className="self-center"
                            />
                        </p>
                    </div>
                </div>
                <HRElement />
            </>
        );
    }
    return (
        <>
            <a
                className={listItemVariants(variant).base}
                target="_blank"
                href={path}
                rel="noreferrer"
            >
                <img
                    src={tagImg}
                    alt=""
                    className={listItemVariants(variant).img}
                    onError={imgOnError}
                />
                <div className={listItemVariants(variant).info}>
                    <div className={listItemVariants(variant).title}>
                        {title}
                    </div>
                    <p className={listItemVariants(variant).lastLine}>
                        <span>{tag}</span>
                        <span className="spacer px-2">•</span>
                        <span className="date">{duration}</span>
                    </p>
                </div>
            </a>
            <HRElement />
        </>
    );
};
