import { FC } from "react";
import { Droppable } from "react-beautiful-dnd";
import { TUserViewWidget } from "src/api/types";
import { calculateTwoColWidgetsHeight } from "src/api/utils/layoutUtils";
import CONFIG from "src/config/config";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import { ETemplateNameRegistry } from "src/constants";
import { TTemplateSlug, TEMPLATES_DICT, IModuleContainer } from "src/types";

const { UI, TWO_COL_WIDGETS } = CONFIG;

interface IDesktopWidgetsViewProps {
    layoutState: TUserViewWidget[][] | undefined;
    twoColWidgets: Record<string, TUserViewWidget | undefined>;
    twoColWidgetCollapsedStates: Record<string, boolean>;
    imageWidgetSize: { width: number; height: number } | undefined;
    twoColWidgetAspectRatios: Record<string, number>;
    handleAspectRatioDetected: (hash: string, ratio: number) => void;
    fullSizeWidgetConfig:
        | {
              slug: TTemplateSlug;
              hash: string | undefined;
          }
        | undefined;
    preferredDragTutorialWidget: [number, number] | undefined;
}

const DesktopWidgetsView: FC<IDesktopWidgetsViewProps> = ({
    layoutState,
    twoColWidgets,
    twoColWidgetCollapsedStates,
    imageWidgetSize,
    twoColWidgetAspectRatios,
    handleAspectRatioDetected,
    fullSizeWidgetConfig,
    preferredDragTutorialWidget,
}) => {
    return (
        <div className="two-col:grid-cols-2 relative three-col:grid-cols-3 four-col:grid-cols-4 grid w-full grid-cols-1 gap-5 px-4">
            <div className="two-col:grid-cols-2 absolute three-col:grid-cols-3 four-col:grid-cols-4 grid w-full grid-cols-1 px-4">
                {Object.entries(TWO_COL_WIDGETS).map(([key, config]) => {
                    const moduleData = twoColWidgets[key];
                    if (!moduleData) return null;

                    const Container = TEMPLATES_DICT[
                        config.templateSlug
                    ] as FC<IModuleContainer>;
                    if (!Container) return null;

                    const isImageWidget =
                        config.templateSlug ===
                        `${ETemplateNameRegistry.Two_Col_Image.toLowerCase()}_template`;

                    return (
                        <div
                            id={
                                isImageWidget
                                    ? UI.IMAGE_WIDGET_SIZE_TRACKING_ID
                                    : ""
                            }
                            key={key}
                            className="col-span-2"
                        >
                            <Container
                                moduleData={moduleData}
                                toggleAdjustable={() => {}}
                                onAspectRatioDetected={
                                    handleAspectRatioDetected
                                }
                            />
                        </div>
                    );
                })}
            </div>
            {layoutState?.map((widgets, colIndex) => (
                <Droppable
                    // eslint-disable-next-line react/no-array-index-key
                    key={colIndex.toString()}
                    droppableId={colIndex.toString()}
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                marginTop: (() => {
                                    if (colIndex !== 0 && colIndex !== 1) {
                                        return "0px";
                                    }

                                    // Filter out undefined values before passing to calculateTwoColWidgetsHeight
                                    const filteredTwoColWidgets =
                                        Object.entries(twoColWidgets).reduce<
                                            Record<string, TUserViewWidget>
                                        >((acc, [key, value]) => {
                                            if (value !== undefined) {
                                                return { ...acc, [key]: value };
                                            }
                                            return acc;
                                        }, {});

                                    const totalHeight =
                                        calculateTwoColWidgetsHeight(
                                            filteredTwoColWidgets,
                                            twoColWidgetCollapsedStates,
                                            imageWidgetSize?.width,
                                            twoColWidgetAspectRatios
                                        );
                                    return totalHeight > 0
                                        ? `${totalHeight}px`
                                        : "0px";
                                })(),
                            }}
                        >
                            {widgets.map((widget, rowIndex) => (
                                <ModuleWrapper
                                    key={widget.hash}
                                    moduleData={widget}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    fullSizeWidgetConfig={fullSizeWidgetConfig}
                                    preferredDragTutorialWidget={
                                        preferredDragTutorialWidget
                                    }
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            ))}
        </div>
    );
};

export default DesktopWidgetsView;
