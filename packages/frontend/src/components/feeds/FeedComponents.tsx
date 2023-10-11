import type { FC, PropsWithChildren, HTMLProps } from "react";
import { twMerge } from "@alphaday/ui-kit";

export const AuthorName: FC<HTMLProps<HTMLAnchorElement>> = ({
    children,
    className,
    ...attributes
}) => (
    <a className={twMerge("font-highlight", className)} {...attributes}>
        {children}
    </a>
);

export const AuthorImage: FC<{ src: string }> = ({ src }) => (
    <div
        className="w-10 h-10 bg-contain rounded-full mx-4"
        style={{ backgroundImage: `url(${src})` }}
    />
);

export const TweetContent: FC<PropsWithChildren> = ({ children }) => (
    <div className="text-left mt-2 max-w-xl overflow-wrap">{children}</div>
);

export const TweetColumn: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div
        className={twMerge("flex flex-col items-start max-w-4/5", className)}
        {...props}
    >
        {children}
    </div>
);

export const TweetAttachment: FC<PropsWithChildren> = ({ children }) => (
    <div className="flex mt-2 items-center justify-between flex-wrap">
        {children}
    </div>
);

interface ITweetMedia<T, E> extends HTMLProps<E> {
    ratio?: number;
    mediaType?: "img" | "video" | "audio";
}

export function TweetMedia<
    T,
    E = T extends "video"
        ? HTMLVideoElement
        : T extends "audio"
        ? HTMLAudioElement
        : HTMLImageElement
>({ ratio = 1, mediaType, className, ...props }: ITweetMedia<T, E>) {
    const MediaComponent = (mediaType as unknown) as FC<HTMLProps<E>>;
    return (
        MediaComponent && (
            <MediaComponent
                className={twMerge(
                    "min-w-[64px] w-full rounded-md mb-4",
                    className
                )}
                {...props}
            />
        )
    );
}

export const TweetWrapper: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div
        className={twMerge(
            "flex items-start cursor-pointer border-b border-btnRingVariant500 bg-backgroundVariant800 hover:bg-backgroundVariant900",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

export const TweetOptions: FC<PropsWithChildren> = ({ children }) => (
    <div className="flex items-center mt-2">{children}</div>
);

export const TweetContainer: FC<PropsWithChildren<{ height: string }>> = ({
    children,
    height,
}) => <div style={{ height }}>{children}</div>;
