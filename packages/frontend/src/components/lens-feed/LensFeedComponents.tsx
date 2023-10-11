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

export const TweetMedia: FC<
    HTMLProps<HTMLObjectElement> & { ratio?: number }
> = ({ data, ratio = 1, className, style, ...props }) => (
    <object
        data={data}
        className={twMerge(
            "min-w-64 w-full h-0 bg-cover rounded-md mt-1 ml-1",
            className
        )}
        style={{
            paddingTop: `${ratio * 100}%`,
            height: data ? 0 : "250px",
            ...style,
        }}
        {...props}
    />
);

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
