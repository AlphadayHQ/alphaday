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
        <ScrollBar onScroll={onScroll}>
            <Pager
                title={title}
                handleBack={handleBack}
                handleClose={handleClose}
            />
            {children}
        </ScrollBar>
    );
};

export default PagedMobileLayout;
