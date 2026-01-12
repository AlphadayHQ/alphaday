import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "src/api/hooks";
import { ReactComponent as WidgetsSVG } from "src/assets/icons/grid.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { ReactComponent as ViewsSVG } from "src/assets/svg/views.svg";

const CustomNavTab: React.FC<{
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
}> = ({ label, icon, disabled }) => (
    <div className="inline-flex flex-col items-center justify-center px-2">
        <span className="rounded-2xl relative">{icon}</span>
        <span className="mt-0.5 fontGroup-supportBold">
            {disabled ? `${label} (soon)` : label}
        </span>
    </div>
);

const MobileNavigation = () => {
    const isMobile = useIsMobile();
    const { pathname } = useLocation();

    return (
        <nav
            className="fixed bottom-0 w-full p-1 pt-2 bg-background border-t border-borderLine"
            style={{
                display: !isMobile ? "none" : "flex",
            }}
        >
            <Link
                to="/"
                className={`flex-1 flex justify-center ${
                    pathname === "/" ? "text-primary" : "text-primaryVariant100"
                }`}
            >
                <CustomNavTab
                    label="Feed"
                    icon={<SuperfeedSVG className="h-[18px]" />}
                />
            </Link>
            <Link
                to="/widgets"
                className={`flex-1 flex justify-center ${
                    pathname === "/widgets"
                        ? "text-primary"
                        : "text-primaryVariant100"
                }`}
            >
                <CustomNavTab
                    label="Widgets"
                    icon={<WidgetsSVG className="h-[22px] -mb-0.5" />}
                />
            </Link>
            <Link
                to="/boards"
                className={`flex-1 flex justify-center ${
                    pathname === "/boards"
                        ? "text-primary"
                        : "text-primaryVariant100"
                }`}
            >
                <CustomNavTab
                    label="Boards"
                    icon={<ViewsSVG className="h-4" />}
                />
            </Link>
        </nav>
    );
};

export default MobileNavigation;
