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
        <div className="p-4 overflow-auto max-h-full">{children}</div>

        {!hideFooter && <Footer />}
    </>
);

MainLayout.defaultProps = {
    hideFooter: false,
    hideFeatures: false,
};

export default MainLayout;
