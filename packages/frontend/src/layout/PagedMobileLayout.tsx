import { FC, ReactNode } from "react";
import { Pager, ScrollBar } from "@alphaday/ui-kit";

const PagedMobileLayout: FC<{
    title: string;
    children: ReactNode;
    onScroll?: () => void;
    handleClose?: () => void;
    handleBack?: () => void;
}> = ({ children, title, onScroll, handleBack, handleClose }) => {
    return (
        <ScrollBar className="h-screen flex flex-col" onScroll={onScroll}>
            <Pager
                title={title}
                handleBack={handleBack}
                handleClose={handleClose}
            />
            <div className="w-full flex flex-grow min-w-max">{children}</div>
        </ScrollBar>
    );
};

export default PagedMobileLayout;
