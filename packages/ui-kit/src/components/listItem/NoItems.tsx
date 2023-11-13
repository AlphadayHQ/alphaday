import { FC, ReactNode } from "react";

export const NoItems: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-backgroundVariant200 prose-p:fontGroup-highlight">
            {children}
        </div>
    );
};
