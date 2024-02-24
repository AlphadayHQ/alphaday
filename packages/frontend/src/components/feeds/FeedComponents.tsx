import type { FC, PropsWithChildren, HTMLProps } from "react";
import { twMerge } from "@alphaday/ui-kit";

/**
 * This renders the author`s name with a hyperlink.
 * It accepts all the properties of an HTMLAnchorElement.
 * The `children` prop is used to display the author`s name.
 */
export const AuthorName: FC<HTMLProps<HTMLAnchorElement>> = ({
    children,
    className,
    ...attributes
}) => {
    return (
        <a
            className={twMerge(
                "font-semibold text-primaryVariant100 hover:text-primary",
                className
            )}
            {...attributes}
        >
            {children}
        </a>
    );
};

/**
 * This displays the author`s image.
 * It requires a `src` prop which is the URL of the image.
 */
export const AuthorImage: FC<{ src: string }> = ({ src }) => {
    return (
        <div
            className="w-10 h-10 bg-contain rounded-full"
            style={{ backgroundImage: `url(${src})` }}
        />
    );
};

/**
 * This displays the content of a tweet.
 * The `children` prop is used to display the tweet`s content.
 */
export const TweetContent: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="text-left mt-2 max-w-xl break-before-auto">
            {children}
        </div>
    );
};

/**
 * This arranges tweets in a column.
 * It accepts all the properties of an HTMLDivElement.
 * The `children` prop is used to display the tweets.
 */
export const TweetColumn: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={twMerge(
                "flex flex-col items-start max-w-4/5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * This displays attachments to a tweet.
 * The `children` prop is used to display the attachments.
 */
export const TweetAttachment: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex mt-2 items-center justify-between flex-wrap">
            {children}
        </div>
    );
};

export interface ITweetMedia<T extends "img" | "video" | "audio", E>
    extends HTMLProps<E> {
    mediaType?: T;
}

/**
 * This displays media attached to a tweet.
 * It accepts all the properties of an HTML element.
 * The `mediaType` which may be `"img" | "video" | "audio"` is used to determine the type of media to display.
 */
export function TweetMedia<
    T extends "img" | "video" | "audio",
    E = T extends "video"
        ? HTMLVideoElement
        : T extends "audio"
          ? HTMLAudioElement
          : HTMLImageElement,
>({ mediaType, className, ...props }: ITweetMedia<T, E>) {
    const MediaComponent = mediaType as unknown as FC<HTMLProps<E>> | null;
    return (
        MediaComponent && (
            <MediaComponent
                className={twMerge(
                    "min-w-[64px] w-full max-w-full rounded-md mb-2",
                    className
                )}
                controls
                {...props}
            />
        )
    );
}

/**
 * This wraps a tweet.
 * It accepts all the properties of an HTMLDivElement.
 * The `children` prop is used to display the tweet.
 */
export const TweetWrapper: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={twMerge(
                "flex items-start py-2 cursor-pointer border-b border-borderLine bg-background hover:bg-background",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * This displays options for a tweet.
 * The `children` prop is used to display the options.
 */
export const TweetOptions: FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex items-center mt-2">{children}</div>;
};

/**
 * This contains a tweet.
 * The `children` prop is used to display the tweet.
 * The `height` prop is used to set the height of the container.
 */
export const TweetContainer: FC<PropsWithChildren<{ height: string }>> = ({
    children,
    height,
}) => {
    return <div style={{ height }}>{children}</div>;
};
