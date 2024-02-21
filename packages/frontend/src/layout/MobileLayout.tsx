import { FC, ReactNode } from "react";
import { NavHeader } from "src/mobile-components/navigation/NavHeader";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
}> = ({ children, onScroll }) => {
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader avatar={undefined} />
            {children}
        </div>
    );
};

export default MobileLayout;
