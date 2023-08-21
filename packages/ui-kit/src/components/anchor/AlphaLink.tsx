import React, { FC } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IAnchor {
    path: string;
    className?: string | undefined;
    rel?: string | undefined;
    label?: string | undefined;
    target?: "_blank" | "_self" | "_parent" | "_top";
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
}

export const AnchorElement: FC<IAnchor> = ({
    path,
    children,
    className,
    rel,
    label,
    target,
    onClick,
    ...rest
}) => (
    <a
        aria-label={label}
        rel={rel}
        className={twMerge(
            className,
            "text-primaryVariant100 fontGroup-highlight hover:text-btnRingVariant100 active:text-btnBackgroundVariant1400 cursor-pointer hover:underline active:underline"
        )}
        href={path}
        target={target}
        onClick={onClick}
        {...rest}
    >
        {children}
    </a>
);
export const AlphaLink: FC<IAnchor> = ({ target, path, ...otherProps }) => {
    const internal = /^\/(?!\/)/.test(path);
    if (!internal) {
        const isHash = path.startsWith("#");
        if (isHash) {
            return <AnchorElement path={path} {...otherProps} />;
        }
        return <AnchorElement path={path} target={target} {...otherProps} />;
    }

    return (
        <Link
            aria-label={otherProps.label}
            rel="preload"
            className={twMerge(
                otherProps.className,
                "text-primaryVariant100 fontGroup-highlight hover:text-btnRingVariant100 active:text-btnBackgroundVariant1400 cursor-pointer hover:underline active:underline"
            )}
            to={path}
            onClick={otherProps.onClick}
            {...otherProps}
        >
            {otherProps.children}
        </Link>
    );
};
