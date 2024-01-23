import { FC, ReactNode } from "react";
import { NavBottom, NavHeader, ScrollBar } from "@alphaday/ui-kit";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
}> = ({ children, onScroll }) => {
    return (
        <ScrollBar onScroll={onScroll}>
            <NavHeader avatar={undefined} />
            {children}
            <NavBottom />
        </ScrollBar>
    );
};

export default MobileLayout;
