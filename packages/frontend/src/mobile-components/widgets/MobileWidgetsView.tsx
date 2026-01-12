import { FC, useState, useMemo, useRef, useCallback } from "react";
import { TabsBar } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import { TEMPLATES_DICT, IModuleContainer } from "src/types";

interface IMobileWidgetsViewProps {
    widgets: TUserViewWidget[];
}

// TODO remove this temporary exclusion list when we have mobile-friendly versions of these templates
// Templates to exclude on mobile
const MOBILE_EXCLUDED_TEMPLATES = [
    "one_col_image_template",
    "two_col_image_template",
];

const MobileWidgetsView: FC<IMobileWidgetsViewProps> = ({ widgets }) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);
    const {
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();
    const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);

    // Combined callback ref to handle both widgetRef and squareRef
    const combinedRef = useCallback(
        (node: HTMLDivElement | null) => {
            widgetRef.current = node;
            squareRef(node);
        },
        [squareRef]
    );

    // Filter out widgets that are excluded on mobile
    const filteredWidgets = useMemo(() => {
        return widgets.filter(
            (widget) =>
                !MOBILE_EXCLUDED_TEMPLATES.includes(widget.widget.template.slug)
        );
    }, [widgets]);

    // Create tab options from filtered widgets
    const tabOptions = useMemo(() => {
        return filteredWidgets.map((widget, index) => ({
            label: widget.name,
            value: String(index),
        }));
    }, [filteredWidgets]);

    // Get the currently selected widget
    const selectedWidget = useMemo(() => {
        if (filteredWidgets.length === 0) return null;
        return filteredWidgets[selectedWidgetIndex];
    }, [filteredWidgets, selectedWidgetIndex]);

    const handleTabChange = (value: string) => {
        const index = parseInt(value, 10);
        if (
            !Number.isNaN(index) &&
            index >= 0 &&
            index < filteredWidgets.length
        ) {
            setSelectedWidgetIndex(index);
        }
    };

    if (filteredWidgets.length === 0) {
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
        <div ref={combinedRef} className="h-full flex flex-col bg-background">
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
            {/* -38px is the height of the tabs bar  */}
            <div
                id={CONFIG.UI.WIDGET_SIZE_TRACKING_ID}
                className="flex flex-col h-[calc(100%-38px)]"
            >
                <Container
                    moduleData={selectedWidget}
                    toggleAdjustable={() => {}}
                    mobileViewWidgetHeight={
                        widgetRef?.current
                            ? widgetRef.current.clientHeight - 38
                            : undefined
                    }
                />
            </div>
        </div>
    );
};

export default MobileWidgetsView;
