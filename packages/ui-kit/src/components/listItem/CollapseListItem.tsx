import { FC, RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { PluggableList } from "react-markdown/lib/react-markdown";
import { twMerge } from "tailwind-merge";
import CollapseButton from "../buttons/CollapseButton";
import styles from "./ListItem.module.scss";

interface ICollapseListItem {
    openAccordion: boolean;
    author?: string;
    title?: string;
    descHeightRef: RefObject<HTMLDivElement>;
    description: string;
    fullHeight: number | undefined;
    variant: "faq" | "agenda" | "roadmap";
    remarkPlugins?: PluggableList;
}

const collapseItemVaraints = (variant: ICollapseListItem["variant"]) => {
    const defaults = {
        base: twMerge(
            styles.collapseItem,
            "info ml-5 min-h-[45px] w-full self-auto border-b border-solid border-b-btnRingVariant500 px-0 pb-[5px] pt-[3px]"
        ),
        title: "flex justify-between",
        collapseButton: "ml-[5px]",
        desc: "desc fontGroup-normal pointer-events-none h-2.5 opacity-0 ease-in-out transition-[height] duration-[0.25s,opacity]",
        wrap: "wrap flex flex-wrap whitespace-pre-wrap prose-p:primary prose-a:secondaryOrange",
        noDesc: "mx-0 my-2.5",
        fullHeight:
            "fullHeight pointer-events-auto overflow-hidden text-ellipsis opacity-100 ease-in-out transition-[height] duration-[0.25s,opacity]",
    };
    const variants = {
        agenda: {
            ...defaults,
            wrap: twMerge(defaults.wrap, "[&_a]:text-secondaryOrange"),
        },
        faq: {
            ...defaults,
            base: twMerge(
                defaults.base,
                "faq w-full min-h-[45px] pt-[3px] pb-[5px] px-0 border-[none]"
            ),
            title: twMerge(defaults.title, "justify-start"),
            desc: twMerge(
                defaults.desc,
                "h-0 pointer-events-none mx-0 my-[5px]"
            ),
            wrap: twMerge(defaults.wrap, "p-[5px 0 0 28px]"),
        },
        roadmap: { ...defaults },
    };

    return variants[variant];
};

export const CollapseListItem: FC<ICollapseListItem> = ({
    openAccordion,
    author,
    title,
    descHeightRef,
    description,
    variant,
    fullHeight,
    remarkPlugins,
}) => {
    return (
        <div className={collapseItemVaraints(variant).base}>
            <div className={collapseItemVaraints(variant).title}>
                {variant === "faq" ? (
                    <>
                        <div
                            className="flex h-[18px] w-[18px] items-center justify-center justify-self-center"
                            role="button"
                            title="Open/close details"
                        >
                            <span
                                className={twMerge(
                                    openAccordion &&
                                        "collapsed before:rotate-[0]",
                                    "before:text-secondaryOrange100 relative inline-block h-[1em] w-[1em] text-lg before:absolute before:top-px before:origin-center before:rotate-90 before:transition-[0.2s] before:duration-[transform] before:ease-[ease] before:content-['▶']"
                                )}
                            />
                        </div>
                        <span className="label">{title}</span>
                    </>
                ) : (
                    <>
                        {title}
                        <CollapseButton isCollapsed={!openAccordion} />
                    </>
                )}
            </div>
            {variant === "agenda" && author && (
                <div className="speaker">{author}</div>
            )}
            <div
                ref={descHeightRef}
                className={twMerge(
                    collapseItemVaraints(variant).desc,
                    openAccordion && collapseItemVaraints(variant).fullHeight
                )}
                style={{
                    height: openAccordion
                        ? `${fullHeight || 109.2}px`
                        : undefined,
                }}
            >
                {openAccordion && (
                    <div className={collapseItemVaraints(variant).wrap}>
                        {description.length > 0 ? (
                            <ReactMarkdown
                                remarkPlugins={remarkPlugins}
                                linkTarget="_blank"
                            >
                                {description}
                            </ReactMarkdown>
                        ) : (
                            <>
                                <div
                                    className={
                                        collapseItemVaraints(variant).wrap
                                    }
                                >
                                    No description.
                                </div>
                                <br />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollapseListItem;
