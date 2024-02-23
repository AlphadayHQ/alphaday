import { FC, ReactNode } from "react";
import { NavHeader } from "src/mobile-components/navigation/NavHeader";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
    onSearchHandleClick: () => void;
}> = ({ children, onScroll, onSearchHandleClick }) => {
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader
                avatar={undefined}
                onSearchHandleClick={onSearchHandleClick}
            />
            {children}
        </div>
    );
};

export default MobileLayout;
