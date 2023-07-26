import { FC } from "react";
import { ReactComponent as PauseSVG } from "src/assets/alphadayAssets/icons/pause.svg";
import { ReactComponent as PlaySVG } from "src/assets/alphadayAssets/icons/play2.svg";
import { computeDuration } from "src/utils/dateUtils";
import { imgOnError } from "src/utils/errorHandling";
import { twMerge } from "tailwind-merge";
import ItemBookmark from "./ItemBookmark";
import styles from "./ListItem.module.scss";

const HRElement = () => <hr className="border-btnRingVariant500 m-0" />;

interface IList {
    variant: "news" | "dao" | "podcast" | "video" | "reports";
    path?: string;
    date: string | Date;
    title: string;
    description?: string;
    source?: string;
    tag: string;
    tagShortName?: string;
    tagImg?: string;
    mediaLength?: string;
    bookmarked?: boolean;
    onClick?: () => MaybeAsync<void>;
    onBookmark?: () => MaybeAsync<void>;
    isAuthenticated?: boolean;
    isPlaying?: boolean;
    image?: string;
}

const listItemVaraints = (variant: IList["variant"]) => {
    const defaults = {
        base: twMerge(
            styles.listItem,
            "flex flex-row items-start w-full p-3.5 bg-backgroundVariant800  hover:bg-backgroundVariant900 active:bg-backgroundVariant1000"
        ),
        info: "grow-[1]",
        date: "fontGroup-mini min-w-[45px] text-primaryVariant100 mr-[5px]",
        title: "fontGroup-highlightSemi text-primary self-stretch grow-0 flex items-center",
        content:
            "content prose-h2:fontGroup-highlightSemi prose-h4:fontGroup-highlightSemi prose-h6:fontGroup-highlightSemi prose-h1:fontGroup-highlight prose-h3:fontGroup-highlight prose-h5:fontGroup-highlight prose-a:secondaryOrange break-word m-0 text-primary",
        readMore: "fontGroup-highlight flex justify-end text-primaryVariant100",
        lastLine: "lastLine fontGroup-mini flex text-primaryVariant100 mt-2",
        spacer: "mx-[7px] my-0",
        bookmark: "block cursor-pointer mt-px",
        img: "w-[15px] h-[15px] mr-[5px] rounded-[100px]",
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
            base: twMerge(
                defaults.base,
                "cursor-pointer bg-backgroundVariant200"
            ),
            img: twMerge(
                defaults.img,
                "w-[38px] h-[38px] mr-3.5 rounded-[100px]"
            ),
        },
        podcast: {
            ...defaults,
            base: twMerge(
                defaults.base,
                "podcast flex-col bg-[color:var(--backgroundVariant200)] cursor-pointer p-[15px] rounded-none"
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
                "video bg-backgroundVariant200 cursor-pointer p-[15px] rounded-none"
            ),
            date: twMerge(defaults.date, "fontGroup-mini min-w-min m-0"),
        },
        reports: { ...defaults },
    };

    return variants[variant];
};

// note external liks have to begin with http:// or https://
export const ListItem: FC<IList> = ({
    variant,
    path,
    date,
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
    const duration = computeDuration(date);

    if (variant === "news") {
        const variantStyle = listItemVaraints("news");

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

    // TODO: remove this if we no longer need it
    if (variant === "reports") {
        const variantStyle = listItemVaraints("reports");
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
                            <a href={tagImg} target="_blank" rel="noreferrer">
                                <span>{tag}</span>{" "}
                            </a>
                            <span className={variantStyle.spacer}>•</span>
                            <img
                                src={source} // TODO: source is image url for tag pill
                                alt=""
                                className={variantStyle.img}
                                onError={imgOnError}
                            />
                        </p>
                    </div>
                </li>
                <HRElement />
            </>
        );
    }

    if (variant === "podcast") {
        const variantStyle = listItemVaraints("podcast");

        return (
            <>
                <li onClick={onClick} className={variantStyle.base}>
                    <div className="top">
                        <img
                            src={tagImg}
                            alt=""
                            className={variantStyle.img}
                            onError={imgOnError}
                        />
                        <div className={variantStyle.info}>
                            <p className="source">{tag}</p>
                            <p className="time">{duration}</p>
                        </div>
                    </div>
                    <div className="text">
                        <p className={variantStyle.title}>{title}</p>
                        <p className="desc">{description}</p>
                    </div>
                    <p className="lastLine center">
                        <span
                            className={twMerge(
                                "fontGroup-normal border-primaryVariant200 bg-btnBackgroundVariant300 text-primary flex h-[23px] w-[77px] flex-row items-center justify-center rounded-lg border border-solid pb-[3px] pl-1.5 pr-2.5 pt-0.5",
                                styles.audioIndicator,
                                isPlaying &&
                                    "bg-secondaryOrange text-btnRingVariant200"
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
                        />
                    </p>
                </li>
                <HRElement />
            </>
        );
    }
    if (variant === "video") {
        const variantStyle = listItemVaraints("video");
        return (
            <>
                <li onClick={onClick} className={variantStyle.base}>
                    <img
                        src={image}
                        alt=""
                        className="image"
                        onError={imgOnError}
                    />
                    <div className="text">
                        <p className={variantStyle.title}>{title}</p>

                        <p className={twMerge(variantStyle.lastLine, "center")}>
                            <span>{tag}</span>{" "}
                            <span className={variantStyle.spacer}>•</span>
                            <span className={variantStyle.date}>
                                {duration}
                            </span>
                            <ItemBookmark
                                isAuthenticated={isAuthenticated}
                                onBookmark={onBookmark}
                                bookmarked={bookmarked}
                            />
                        </p>
                    </div>
                </li>
                <HRElement />
            </>
        );
    }
    return (
        <>
            <a
                className={listItemVaraints(variant).base}
                target="_blank"
                href={path}
                rel="noreferrer"
            >
                <img
                    src={tagImg}
                    alt=""
                    className={listItemVaraints(variant).img}
                    onError={imgOnError}
                />
                <div className={listItemVaraints(variant).info}>
                    <div className={listItemVaraints(variant).title}>
                        {title}
                    </div>
                    <p className={listItemVaraints(variant).lastLine}>
                        <span>{tag}</span> <span className="spacer">•</span>
                        <span className="date">{duration}</span>
                    </p>
                </div>
            </a>
            <HRElement />
        </>
    );
};
