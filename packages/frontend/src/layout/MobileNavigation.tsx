import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "src/api/hooks";
import { ReactComponent as WidgetsSVG } from "src/assets/icons/grid.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";

const CustomNavTab: React.FC<{
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean;
}> = ({ label, Icon, disabled }) => (
    <div className="inline-flex flex-col items-center justify-center px-2">
        <span className="rounded-2xl relative">
            <Icon className="h-5" />
        </span>
        <span className="mt-0.5 fontGroup-supportBold">
            {disabled ? `${label} (soon)` : label}
        </span>
        {/* {disabled && <div className="text-xs leading-3">(soon)</div>} */}
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
                // to={EMobileTabRoutePaths.Superfeed}
                to="/"
                className={`flex-1 flex justify-center ${
                    // pathname === EMobileTabRoutePaths.Superfeed
                    pathname === "/" ? "text-primary" : "text-primaryVariant100"
                }`}
            >
                <CustomNavTab label="Feed" Icon={SuperfeedSVG} />
            </Link>
            <Link
                // to={EMobileRoutePaths.BoardsLibrary}
                to="/widget"
                className={`flex-1 flex justify-center ${
                    // pathname === EMobileRoutePaths.BoardsLibrary
                    pathname === "/widgets"
                        ? "text-primary"
                        : "text-primaryVariant100"
                }`}
            >
                <CustomNavTab label="Widgets" Icon={WidgetsSVG} />
            </Link>
        </nav>
    );
};

export default MobileNavigation;
