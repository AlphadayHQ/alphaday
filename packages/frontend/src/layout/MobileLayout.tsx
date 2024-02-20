import { FC, ReactNode } from "react";
import { NavBottom, NavHeader } from "@alphaday/ui-kit";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
}> = ({ children, onScroll }) => {
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader avatar={undefined} />
            {children}
            {/* <NavBottom /> */}
        </div>
    );
};

export default MobileLayout;
