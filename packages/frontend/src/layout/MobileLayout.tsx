import { FC, ReactNode } from "react";
import { NavBottom, NavHeader } from "@alphaday/ui-kit";

const MobileLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div>
            <NavHeader avatar={undefined} />
            {children}
            <NavBottom />
        </div>
    );
};

export default MobileLayout;
