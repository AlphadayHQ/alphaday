import { FC, useState, useMemo, useRef, useCallback } from "react";
import { TabsBar } from "@alphaday/ui-kit";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { MOBILE_DEPRIORITIZED_TEMPLATES } from "src/config/widgets";
import CONFIG from "src/config";
import { TEMPLATES_DICT, IModuleContainer } from "src/types";

interface IMobileWidgetsViewProps {
    widgets: TUserViewWidget[];
}

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

    // Reorder widgets to ensure deprioritized templates don't appear in first 3 positions
    const reorderedWidgets = useMemo(() => {
        const result = [...widgets];
        const deprioritizedTemplates =
            MOBILE_DEPRIORITIZED_TEMPLATES as readonly string[];

        // Check first 3 positions
        for (let i = 0; i < Math.min(3, result.length); i += 1) {
            const widget = result[i];
            if (deprioritizedTemplates.includes(widget.widget.template.slug)) {
                // Find first non-deprioritized widget after position i
                const swapIndex = result.findIndex(
                    (w, idx) =>
                        idx > i &&
                        !deprioritizedTemplates.includes(w.widget.template.slug)
                );

                if (swapIndex !== -1) {
                    // Swap positions
                    [result[i], result[swapIndex]] = [
                        result[swapIndex],
                        result[i],
                    ];
                }
            }
        }

        return result;
    }, [widgets]);

    // Create tab options from reordered widgets
    const tabOptions = useMemo(() => {
        return reorderedWidgets.map((widget, index) => ({
            label: widget.name,
            value: String(index),
        }));
    }, [reorderedWidgets]);

    // Get the currently selected widget
    const selectedWidget = useMemo(() => {
        if (reorderedWidgets.length === 0) return null;
        return reorderedWidgets[selectedWidgetIndex];
    }, [reorderedWidgets, selectedWidgetIndex]);

    const handleTabChange = (value: string) => {
        const index = parseInt(value, 10);
        if (
            !Number.isNaN(index) &&
            index >= 0 &&
            index < reorderedWidgets.length
        ) {
            setSelectedWidgetIndex(index);
        }
    };

    if (reorderedWidgets.length === 0) {
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
