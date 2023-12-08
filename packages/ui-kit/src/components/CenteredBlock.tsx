import { FC, ReactNode } from "react";

export const CenteredBlock: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background prose-p:fontGroup-highlightSemi">
            {children}
        </div>
    );
};
