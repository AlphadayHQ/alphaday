import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import { Z_INDEX_REGISTRY } from "../../config/zIndexRegistry";

export const HeaderWrapper: FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <header
            className={twMerge(
                "fixed inset-x-0 top-0 flex flex-col bg-background",
                className
            )}
            style={{
                zIndex: Z_INDEX_REGISTRY.HEADER,
            }}
        >
            {children}
        </header>
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
                "bg-background two-col:h-[60px] two-col:top-0 two-col:inset-x-0 relative flex flex-row flex-wrap items-stretch justify-between p-0", // mb-[2.5px] is to make sure the distance between the viewstab and the searchbar is 12px
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
                "single-col:py-0 single-col:px-[15px] two-col:p-0 order-2 -mt-0.5 flex items-center justify-end py-0 pl-2.5 pr-5",
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
