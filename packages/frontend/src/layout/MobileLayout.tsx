import { FC, ReactNode } from "react";
import { NavBottom, NavHeader } from "@alphaday/ui-kit";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
    toggleShowUserMenu: () => void;
}> = ({ children, onScroll, toggleShowUserMenu }) => {
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader
                avatar={undefined}
                toggleShowUserMenu={toggleShowUserMenu}
            />
            {children}
            <NavBottom />
        </div>
    );
};

export default MobileLayout;
