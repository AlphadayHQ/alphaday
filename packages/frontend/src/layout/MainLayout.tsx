import React, { useState } from "react";
import { Footer, twMerge } from "@alphaday/ui-kit";
import { TUserViewWidget } from "src/api/types";
import WidgetsLibContainer from "src/containers/widgets-library/WidgetsLibContainer";
import Header from "./LayoutHeader";
import MobileNavigation from "./MobileNavigation";

interface IProps {
    hideFooter?: boolean;
    hideFeatures?: boolean;
    toggleWidgetLib?: () => void;
    toggleLanguageModal?: () => void;
    toggleRecipeLibrary?: () => void;
    viewName?: string;
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
    toggleLanguageModal,
    toggleRecipeLibrary,
    viewName,
    layoutState,
    setTutFocusElemRef,
}) => {
    const [isBoardsLibOpen, setIsBoardsLibOpen] = useState(false);
    return (
        <div className="relative max-h-screen max-w-screen">
            <Header
                hideFeatures={!!hideFeatures}
                toggleWidgetLib={toggleWidgetLib}
                toggleLanguageModal={toggleLanguageModal}
                toggleRecipeLibrary={toggleRecipeLibrary}
                setTutFocusElemRef={setTutFocusElemRef}
                isBoardsLibOpen={isBoardsLibOpen}
                setIsBoardsLibOpen={setIsBoardsLibOpen}
                viewName={viewName}
            />
            <WidgetsLibContainer layoutState={layoutState} />
            <div
                className={twMerge(
                    "flex bg-background justify-center",
                    !isBoardsLibOpen && "max-h-screen overflow-y-auto"
                )}
            >
                {/* pt-[6.5px] here is to make sure the board arae is exactly 12px away from the views tab */}
                <div className="m-0 mt-16 p-0 pb-[50px] two-col:pb-10 bg-background min-h-[calc(100vh_-_64px)] w-screen two-col:mt-[110px] four-col:max-w-[2725px]">
                    {children}
                </div>
            </div>
            <MobileNavigation />
            {!hideFooter && <Footer />}
        </div>
    );
};

MainLayout.defaultProps = {
    hideFooter: false,
    hideFeatures: false,
};

export default MainLayout;
