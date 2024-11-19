import React, { useState } from "react";
import { Footer, twMerge } from "@alphaday/ui-kit";
import { TUserViewWidget } from "src/api/types";
import WidgetsLibContainer from "src/containers/widgets-library/WidgetsLibContainer";
import Header from "./LayoutHeader";

interface IProps {
    hideFooter?: boolean;
    hideFeatures?: boolean;
    toggleWidgetLib?: () => void;
    layoutState?: TUserViewWidget[][];
    children?: React.ReactNode;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const MainLayout: React.FC<IProps> = ({
    children,
    hideFooter,
    hideFeatures,
    toggleWidgetLib,
    layoutState,
    setTutFocusElemRef,
}) => {
    const [isBoardsLibOpen, setIsBoardsLibOpen] = useState(false);
    return (
        <div className="relative overflow-scroll max-h-screen max-w-screen">
            <Header
                hideFeatures={!!hideFeatures}
                toggleWidgetLib={toggleWidgetLib}
                setTutFocusElemRef={setTutFocusElemRef}
                isBoardsLibOpen={isBoardsLibOpen}
                setIsBoardsLibOpen={setIsBoardsLibOpen}
            />
            <WidgetsLibContainer layoutState={layoutState} />
            <div
                className={twMerge(
                    "flex bg-background justify-center overflow-y-auto",
                    !isBoardsLibOpen && "max-h-screen"
                )}
            >
                {/* pt-[6.5px] here is to make sure the board arae is exactly 12px away from the views tab */}
                <div className="m-0 mt-[60px] p-0 pb-10 pt-[10.5px] bg-background min-h-[calc(100vh_-_31px)] w-screen two-col:mt-[110px] four-col:max-w-[2725px]">
                    {children}
                </div>
            </div>

            {!hideFooter && <Footer />}
        </div>
    );
};

MainLayout.defaultProps = {
    hideFooter: false,
    hideFeatures: false,
};

export default MainLayout;
