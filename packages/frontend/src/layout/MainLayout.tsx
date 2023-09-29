import React from "react";
import { Footer } from "@alphaday/ui-kit";
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
}) => (
    <>
        <Header
            hideFeatures={!!hideFeatures}
            toggleWidgetLib={toggleWidgetLib}
            setTutFocusElemRef={setTutFocusElemRef}
        />
        <WidgetsLibContainer layoutState={layoutState} />
        <div className="flex bg-background justify-center overflow-y-auto max-h-screen">
            <div className="m-0 mt-[60px] p-0 pb-10 pt-[25px] bg-background min-h-[calc(100vh_-_31px)] w-screen two-col:mt-[110px] four-col:max-w-[2725px]">
                {children}
            </div>
        </div>

        {!hideFooter && <Footer />}
    </>
);

MainLayout.defaultProps = {
    hideFooter: false,
    hideFeatures: false,
};

export default MainLayout;
