import type { FC, PropsWithChildren, HTMLProps } from "react";
import { twMerge } from "@alphaday/ui-kit";

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

export const AuthorImage: FC<{ src: string }> = ({ src }) => {
    return (
        <div
            className="w-10 h-10 bg-contain rounded-full"
            style={{ backgroundImage: `url(${src})` }}
        />
    );
};

export const TweetContent: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="text-left mt-2 max-w-xl overflow-wrap">{children}</div>
    );
};

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

export const TweetAttachment: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex mt-2 items-center justify-between flex-wrap">
            {children}
        </div>
    );
};

export interface ITweetMedia<T extends "img" | "video" | "audio", E>
    extends HTMLProps<E> {
    ratio?: number;
    mediaType?: T;
}

export function TweetMedia<
    T extends "img" | "video" | "audio",
    E = T extends "video"
        ? HTMLVideoElement
        : T extends "audio"
        ? HTMLAudioElement
        : HTMLImageElement
>({ ratio = 1, mediaType, className, ...props }: ITweetMedia<T, E>) {
    const MediaComponent = (mediaType as unknown) as FC<HTMLProps<E>> | null;
    return (
        MediaComponent && (
            <MediaComponent
                className={twMerge(
                    "min-w-[64px] w-full rounded-md mb-2",
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
}) => {
    return (
        <div
            className={twMerge(
                "flex items-start py-2 cursor-pointer border-b border-btnRingVariant500 bg-backgroundVariant800 hover:bg-backgroundVariant900",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const TweetOptions: FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex items-center mt-2">{children}</div>;
};

export const TweetContainer: FC<PropsWithChildren<{ height: string }>> = ({
    children,
    height,
}) => {
    return <div style={{ height }}>{children}</div>;
};
