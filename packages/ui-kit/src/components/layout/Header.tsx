import React, { FC } from "react";
import { Z_INDEX_REGISTRY } from "../../config/zIndexRegistry";
import { twMerge } from "tailwind-merge";

export const HeaderWrapper: FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div
            className={twMerge(
                `z-[${Z_INDEX_REGISTRY.HEADER}] fixed inset-x-0 top-0 flex flex-col`,
                className
            )}
        >
            {children}
        </div>
    );
};

export const HeaderNavbar: FC<{
    children: React.ReactNode;
    className?: string;
    mobileOpen?: boolean;
}> = ({ children, className, mobileOpen }) => {
    return (
        <div
            className={twMerge(
                "bg-backgroundVariant100 twoCol:h-[60px] twoCol:top-0 twoCol:inset-x-0 relative flex flex-row flex-wrap items-stretch justify-between p-0 px-4 py-2",
                mobileOpen ? "h-auto" : "h-16",
                className
            )}
        >
            {children}
        </div>
    );
};

export const HeaderNavRight: FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div
            className={twMerge(
                "oneCol:py-0 oneCol:px-[15px] twoCol:p-0 twoCol:pr-5 order-2 -mt-0.5 flex items-center justify-end py-0 pl-2.5 pr-5",
                className
            )}
        >
            {children}
        </div>
    );
};

export const HeaderNavElement: FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};
