import { FC, useMemo, memo, FormEvent } from "react";
import { ModuleLoader, ScrollBar, Switch } from "@alphaday/ui-kit";
import useElementSize from "src/api/hooks/useElementSize";
import { TProjectTvlHistory, TProjectData, TProjectType } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import { ProtocolTvlItem, ChainTvlItem, TvlItemsHeader } from "./TvlItem";

interface ITvl {
    isLoading: boolean;
    projectsTvlData: TProjectData[] | undefined;
    projectsTvlHistory: TProjectTvlHistory[] | undefined;
    widgetHeight: number;
    handlePaginate: (type: "next" | "previous") => void;
    selectedProjectType: TProjectType;
    onSwitchProjectType: () => void;
}
const TvlModule: FC<ITvl> = memo(function TvlModule({
    isLoading,
    projectsTvlData,
    projectsTvlHistory,
    widgetHeight,
    handlePaginate,
    selectedProjectType,
    onSwitchProjectType,
}) {
    const [squareRef, { width }] = useElementSize();

    const THRESHOLD = 475;
    const HEADER_HEIGHT = 34;
    const LIST_HEIGHT = useMemo(
        () =>
            width >= THRESHOLD ? widgetHeight - HEADER_HEIGHT : widgetHeight,
        [widgetHeight, width]
    );

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    if (isLoading) {
        return <ModuleLoader $height={`${LIST_HEIGHT}px`} />;
    }

    return (
        <div ref={squareRef}>
            <div className="relative p-0">
                <Switch
                    options={["Chains", "Protocols"]}
                    checked={selectedProjectType === "protocol"}
                    onChange={onSwitchProjectType}
                    className="m-[15px]"
                />
                <div className="h-0 m-0 overflow-hidden border-t border-solid border-btnRingVariant500" />
                {projectsTvlData?.length !== 0 && width >= THRESHOLD && (
                    <TvlItemsHeader projectType={selectedProjectType} />
                )}
                <ul className="mt-0" style={{ height: `${LIST_HEIGHT}px` }}>
                    {projectsTvlData !== undefined &&
                    projectsTvlData?.length !== 0 ? (
                        <ScrollBar onScroll={handleListScroll}>
                            {projectsTvlData?.map((project, i) => (
                                <li
                                    className="flex items-center border-y border-btnRingVariant500 cursor-pointer p-0 [&:nth-of-type(1)]:border-top-0"
                                    key={project.id}
                                >
                                    {selectedProjectType === "protocol" ? (
                                        <ProtocolTvlItem
                                            twoRowCellLayout={width < THRESHOLD}
                                            projectData={project}
                                            projectHistory={projectsTvlHistory?.find(
                                                (p) =>
                                                    p.project.slug ===
                                                    project.project.slug
                                            )}
                                            index={i}
                                        />
                                    ) : (
                                        <ChainTvlItem
                                            projectData={project}
                                            index={i}
                                        />
                                    )}
                                </li>
                            ))}
                        </ScrollBar>
                    ) : (
                        <div className="flex w-full h-full justify-center items-center bg-backgroundVariant200">
                            <p className="text-primary fontGroup-highlight">
                                {globalMessages.queries.noMatchFound("TVL")}
                            </p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
});

export default TvlModule;
