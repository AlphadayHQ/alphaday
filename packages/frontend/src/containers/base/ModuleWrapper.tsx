// TODO (xavier-charles): uncomment the commented code
import { FC, useState, useCallback, memo } from "react";
import { Draggable } from "react-beautiful-dnd";
// import { useNavigate } from "react-router-dom";
import { useTutorial } from "src/api/hooks";
import { useAppSelector } from "src/api/store/hooks";
import * as viewsStore from "src/api/store/slices/views";
import { ETutorialTipId, TUserViewWidget } from "src/api/types";
// import { getItemStyle } from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { buildViewPath, getWidgetName } from "src/api/utils/viewUtils";
import CONFIG from "src/config";
import {
    TEMPLATES_DICT,
    FULLSIZE_ROUTES_DICT,
    TTemplateSlug,
    IModuleContainer,
} from "src/types";
import BaseContainer from "./BaseContainer";

interface IModuleWrapper {
    rowIndex: number;
    colIndex: number;
    moduleData: TUserViewWidget;
    preferredDragTutorialWidget?: number[];
    fullSizeWidgetConfig?: {
        slug: TTemplateSlug;
        hash: string | undefined;
    };
}

const ModuleWrapper: FC<IModuleWrapper> = ({
    moduleData,
    rowIndex,
    colIndex,
    preferredDragTutorialWidget,
    fullSizeWidgetConfig,
}) => {
    // const navigate = useNavigate();
    const selectedView = useAppSelector(viewsStore.selectedViewSelector);
    const { currentTutorial, setTutFocusElemRef } = useTutorial();

    const templateSlug = moduleData.widget.template.slug;
    const widgetName = getWidgetName(templateSlug);

    const { ADJUSTABLE = true } = widgetName ? CONFIG.WIDGETS[widgetName] : {};
    const [isAdjustable, setIsAdjustable] = useState(ADJUSTABLE);

    const handleAdjustable = useCallback(
        () => setIsAdjustable((prev) => !prev),
        []
    );

    /**
     * The registered container component for this widget
     *
     * The assertion below is needed to render the widgets as we do not know the types
     * the module containers expect. Only the container is aware of its data types.
     */
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const ModuleContainer = TEMPLATES_DICT[templateSlug] as
        | FC<IModuleContainer>
        | undefined;

    // if we do not yet support this template, then we should gracefully exit
    if (ModuleContainer === undefined) return null;

    const viewPath = buildViewPath(selectedView?.data);

    const showFullSize = fullSizeWidgetConfig?.hash === moduleData.hash;

    // if the widget template slug is defined as a full-size widget, then we should allow it to be full-sized
    const allowFullSize = templateSlug in FULLSIZE_ROUTES_DICT;

    const isDragTutorialWidget =
        colIndex === preferredDragTutorialWidget?.[0] &&
        rowIndex === preferredDragTutorialWidget?.[1];

    return (
        <Draggable
            isDragDisabled={false}
            draggableId={moduleData.hash}
            index={rowIndex}
        >
            {(provided, { isDragging }) => (
                <div
                    id={
                        // track only the widgetSize of the first element
                        selectedView?.data.widgets?.[0]?.hash ===
                        moduleData.hash
                            ? CONFIG.UI.WIDGET_SIZE_TRACKING_ID
                            : ""
                    }
                    className="item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    // style={{
                    //     ...getItemStyle(
                    //         provided.draggableProps.style,
                    //         isDragging
                    //     ),
                    // }}
                >
                    <BaseContainer
                        uiProps={{
                            dragProps: provided.dragHandleProps ?? undefined,
                            isDragging,
                            onToggleShowFullSize: (val: "open" | "close") => {
                                if (val === "open") {
                                    const fullSizePath =
                                        FULLSIZE_ROUTES_DICT[templateSlug]
                                            ?.routes[0];
                                    if (
                                        viewPath === "/" ||
                                        fullSizePath === undefined
                                    ) {
                                        Logger.error(
                                            "ModuleWrapper: could not build full-size widget url, it should never happen. Widget slug:",
                                            templateSlug
                                        );
                                    }
                                    // navigate(
                                    //     `${viewPath}${fullSizePath.substring(
                                    //         1 // remove the `/` at the beginning
                                    //     )}`
                                    // );
                                } else {
                                    // navigate(viewPath);
                                }
                            },
                            allowFullSize,
                            showFullSize,
                            setTutFocusElemRef:
                                currentTutorial.tip?.id ===
                                    ETutorialTipId.ReArrangeWidget &&
                                isDragTutorialWidget
                                    ? setTutFocusElemRef
                                    : undefined,
                        }}
                        moduleData={moduleData}
                        adjustable={isAdjustable}
                    >
                        <ModuleContainer
                            moduleData={moduleData}
                            showFullSize={showFullSize}
                            toggleAdjustable={handleAdjustable}
                        />
                    </BaseContainer>
                </div>
            )}
        </Draggable>
    );
};

export default memo(ModuleWrapper);
