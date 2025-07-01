import { FC, RefObject } from "react";
import ReactMarkdown from "react-markdown";
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
    remarkPlugins?: (() => (tree: Node) => void)[];
}

const collapseItemVaraints = (variant: ICollapseListItem["variant"]) => {
    const defaults = {
        base: twMerge(
            styles.collapseItem,
            "info ml-5 min-h-[45px] w-full [align-self:normal] border-b border-solid border-b-borderLine px-0 pb-[5px] pt-[3px]"
        ),
        title: "flex justify-between",
        collapseButton: "ml-[5px]",
        desc: "desc fontGroup-normal pointer-events-none h-2.5 opacity-0 ease-[ease] transition-all duration-300",
        wrap: "wrap flex flex-wrap whitespace-pre-wrap prose-p:primary prose-a:secondaryOrange",
        noDesc: "mx-0 my-2.5",
        fullHeight:
            "fullHeight pointer-events-auto overflow-hidden text-ellipsis opacity-100 ease-[ease] transition-all duration-300",
    };
    const variants = {
        agenda: {
            ...defaults,
            wrap: twMerge(defaults.wrap, "[&_a]:text-secondaryOrange"),
            title: twMerge(defaults.title, "fontGroup-highlight"),
            desc: twMerge(defaults.desc, "mt-2"),
        },
        faq: {
            ...defaults,
            base: twMerge(
                defaults.base,
                "faq w-full min-h-[45px] pt-[3px] pb-[5px] px-0 border-[none] border-0"
            ),
            title: twMerge(
                defaults.title,
                "fontGroup-highlight text-primary self-stretch items-baseline flex-grow-0 justify-start"
            ),
            desc: twMerge(
                defaults.desc,
                "h-0 pointer-events-none mx-0 mb-1 mt-2"
            ),
            wrap: twMerge(defaults.wrap, "p-0 pt-[5px] pl-7"),
        },
        roadmap: {
            ...defaults,
            title: twMerge(
                defaults.title,
                "text-primary fontGroup-highlight self-stretch flex-grow-0"
            ),
            wrap: twMerge(defaults.wrap, "pt-[5px]"),
        },
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
                                    openAccordion
                                        ? "collapsed before:rotate-90"
                                        : "before:rotate-[0]",
                                    "before:text-secondaryOrange100 relative inline-block h-[1em] w-[1em] text-lg before:absolute before:top-px before:origin-center before:transition-[0.2s] before:duration-[transform] before:ease-[ease] before:content-['▶']"
                                )}
                            />
                        </div>
                        <span className="mr-[5px] ml-[10px] fontGroup-highlight">
                            {title}
                        </span>
                    </>
                ) : (
                    <>
                        {title}
                        <CollapseButton isCollapsed={!openAccordion} />
                    </>
                )}
            </div>
            {variant === "agenda" && author && (
                <div className="speaker  fontGroup-normal text-primaryVariant100">
                    {author}
                </div>
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
                            <div className="prose-a:text-secondaryOrange">
                                <ReactMarkdown remarkPlugins={remarkPlugins}>
                                    {description}
                                </ReactMarkdown>
                            </div>
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
