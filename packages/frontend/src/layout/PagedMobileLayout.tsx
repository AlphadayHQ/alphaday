import { FC, ReactNode } from "react";
import { Pager, ScrollBar } from "@alphaday/ui-kit";
import { useHistory } from "src/api/hooks";

const PagedMobileLayout: FC<{
    title: string;
    children: ReactNode;
    onScroll?: () => void;
    handleClose?: () => void;
    handleBack?: () => void;
}> = ({ children, title, onScroll, handleBack, handleClose }) => {
    const { backNavigation } = useHistory();
    return (
        <ScrollBar className="h-screen flex flex-col" onScroll={onScroll}>
            <Pager
                title={title}
                handleBack={() => {
                    handleBack?.();
                    backNavigation();
                }}
                handleClose={handleClose}
            />
            <div className="w-full flex flex-grow flex-col">{children}</div>
        </ScrollBar>
    );
};

export default PagedMobileLayout;
