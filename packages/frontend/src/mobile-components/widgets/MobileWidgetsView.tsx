import { FC, useState, useMemo } from "react";
import { TabsBar } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { TEMPLATES_DICT, IModuleContainer } from "src/types";

interface IMobileWidgetsViewProps {
    widgets: TUserViewWidget[];
}

const MobileWidgetsView: FC<IMobileWidgetsViewProps> = ({ widgets }) => {
    const {
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();
    const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);

    // Create tab options from widgets
    const tabOptions = useMemo(() => {
        return widgets.map((widget, index) => ({
            label: widget.name,
            value: String(index),
        }));
    }, [widgets]);

    // Get the currently selected widget
    const selectedWidget = useMemo(() => {
        if (widgets.length === 0) return null;
        return widgets[selectedWidgetIndex];
    }, [widgets, selectedWidgetIndex]);

    const handleTabChange = (value: string) => {
        const index = parseInt(value, 10);
        if (!Number.isNaN(index) && index >= 0 && index < widgets.length) {
            setSelectedWidgetIndex(index);
        }
    };

    if (widgets.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
                <p className="text-primaryVariant100 text-center">
                    No widgets in this board. Add widgets from the widgets
                    library.
                </p>
            </div>
        );
    }

    if (!selectedWidget) {
        return null;
    }

    const Container = TEMPLATES_DICT[
        selectedWidget.widget.template.slug
    ] as FC<IModuleContainer>;

    if (!Container) {
        Logger.warn(
            `MobileWidgetsView: No container found for template ${selectedWidget.widget.template.slug}`
        );
        return null;
    }

    return (
        <div ref={squareRef} className="h-full flex flex-col bg-background">
            {/* Tabs Bar */}
            <div className="sticky top-0 z-10 bg-background">
                <TabsBar
                    options={tabOptions}
                    onChange={handleTabChange}
                    selectedOption={tabOptions[selectedWidgetIndex]}
                    setHeaderRef={setHeaderRef}
                    handleClickScroll={handleClickScroll}
                    hideLeftPan={hideLeftPan}
                    hideRightPan={hideRightPan}
                />
            </div>

            {/* Widget Content */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
                <Container
                    moduleData={selectedWidget}
                    toggleAdjustable={() => {}}
                />
            </div>
        </div>
    );
};

export default MobileWidgetsView;
