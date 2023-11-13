import { FC, useCallback, useRef, useState } from "react";
import { Dialog, Modal, twMerge } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { useView } from "src/api/hooks";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { EWidgetSettingsRegistry } from "src/constants";
import { FULLSIZE_ROUTES_DICT, TCategoryData } from "src/types";
import BaseContainerHeader from "../base/BaseContainerHeader";
import CalendarContainer from "./CalendarContainer";

const CalendarFullContainer: FC<{
    isFullsize: boolean | undefined;
    moduleData: TUserViewWidget;
    viewPath: string;
}> = ({ moduleData, isFullsize, viewPath }) => {
    const history = useHistory();
    const { removeTagFromViewWidget } = useView();
    const headerRef = useRef<HTMLDivElement>(null);

    const [showMobileDialog, setShowMobileDialog] = useState(false);
    const handleShowDialog = () => {
        setShowMobileDialog(false);
    };

    const title = (moduleData.name || moduleData.widget.name).toUpperCase();
    const templateSlug = moduleData.widget?.template.slug;
    const tagsSettings = moduleData.settings.filter(
        (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const onToggleShowFullSize = useCallback(
        (val: "open" | "close") => {
            if (val === "open") {
                const fullSizePath =
                    FULLSIZE_ROUTES_DICT[templateSlug]?.routes[0];
                if (viewPath === "/" || fullSizePath === undefined) {
                    Logger.error(
                        "ModuleWrapper: could not build full-size widget url, it should never happen. Widget slug:",
                        templateSlug
                    );
                }
                history.push(
                    `${viewPath}${fullSizePath?.substring(
                        1 // remove the `/` at the beginning
                    )}`
                );
            } else {
                history.push(viewPath);
            }
        },
        [history, templateSlug, viewPath]
    );

    const handleShowFullSize = useCallback(() => {
        if (isFullsize) onToggleShowFullSize("close");
        else onToggleShowFullSize("open");
    }, [onToggleShowFullSize, isFullsize]);

    return (
        <div className={isFullsize ? "" : "hidden"}>
            <Modal
                size="max"
                showModal={!!isFullsize}
                onClose={handleShowFullSize}
                className="trespasserd"
            >
                <BaseContainerHeader
                    headerRef={headerRef}
                    toggleCollapse={() => {}}
                    tags={tags}
                    handleShowFullSize={handleShowFullSize}
                    title={title}
                    removeTagFromViewWidget={removeTagFromViewWidget}
                    widgetDescription={moduleData.widget.description}
                    removeWidget={() => {}}
                    toggleSettings={undefined}
                    alreadyCollapsed
                    moduleData={moduleData}
                    showFullSize
                    allowFullSize
                />
                <CalendarContainer
                    moduleData={
                        moduleData as TUserViewWidget<TCategoryData[][]>
                    }
                    toggleAdjustable={() => {}}
                    showFullSize
                />
                <div className="foot-block" />
            </Modal>
            <Dialog
                title="Alphaday"
                showXButton
                saveButtonText="Close"
                showDialog={showMobileDialog}
                onSave={handleShowDialog}
                onClose={handleShowDialog}
                className={twMerge(
                    "hidden",
                    isFullsize && "block",
                    "two-col:hidden"
                )}
            >
                <p>Switch to Desktop to get the best experience of {title}</p>
            </Dialog>
        </div>
    );
};

export default CalendarFullContainer;
