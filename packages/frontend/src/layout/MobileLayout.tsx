import { FC, ReactNode } from "react";
import { NavHeader } from "src/mobile-components/navigation/NavHeader";

const MobileLayout: FC<{
    children: ReactNode;
    avatar?: string;
    onScroll?: () => void;
    onSearchHandleClick?: () => void;
}> = ({ children, onScroll, avatar, onSearchHandleClick }) => {
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader
                avatar={avatar}
                onSearchHandleClick={onSearchHandleClick}
            />
            {children}
        </div>
    );
};

export default MobileLayout;
