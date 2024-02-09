import { FC, ReactNode } from "react";
import { NavBottom, NavHeader } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { useAuth } from "src/api/hooks";

const MobileLayout: FC<{
    children: ReactNode;
    onScroll?: () => void;
}> = ({ children, onScroll }) => {
    const { isAuthenticated } = useAuth();
    const history = useHistory();
    return (
        <div className="h-screen" onScroll={onScroll}>
            <NavHeader
                avatar={undefined}
                onAvatarClick={() => {
                    if (!isAuthenticated) {
                        // TODO: Open page with login info
                        history.push("/auth");
                    }
                }}
            />
            {children}
            <NavBottom />
        </div>
    );
};

export default MobileLayout;
