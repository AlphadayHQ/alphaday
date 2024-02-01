import { FC, useMemo, memo, FormEvent } from "react";
import { ModuleLoader, ScrollBar, TabsBar } from "@alphaday/ui-kit";
import useElementSize from "src/api/hooks/useElementSize";
import { TProjectTvlHistory, TProjectData, TProjectType } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import globalMessages from "src/globalMessages";
import { ProtocolTvlItem, ChainTvlItem, TvlItemsHeader } from "./TvlItem";

export enum ETVLItemPreference {
    Chain = "chain",
    Protocol = "protocol",
}
interface ITvl {
    isLoading: boolean;
    projectsTvlData: TProjectData[] | undefined;
    projectsTvlHistory: TProjectTvlHistory[] | undefined;
    widgetHeight: number;
    handlePaginate: (type: "next" | "previous") => void;
    selectedProjectType: TProjectType;
    onChangeProjectType: (type: ETVLItemPreference) => void;
}

const TVL_NAV_ITEMS = [
    {
        label: "Chains",
        value: ETVLItemPreference.Chain,
    },
    {
        label: "Protocols",
        value: ETVLItemPreference.Protocol,
    },
];

const TvlModule: FC<ITvl> = memo(function TvlModule({
    isLoading,
    projectsTvlData,
    projectsTvlHistory,
    widgetHeight,
    handlePaginate,
    selectedProjectType,
    onChangeProjectType,
}) {
    const [squareRef, { width }] = useElementSize();

    const THRESHOLD = 475;
    const SWITCH_HEIGHT = 38;
    const LIST_HEADER_HEIGHT = 28;
    const LIST_HEIGHT = useMemo(
        () =>
            width >= THRESHOLD
                ? widgetHeight - (SWITCH_HEIGHT + LIST_HEADER_HEIGHT)
                : widgetHeight - SWITCH_HEIGHT,
        [widgetHeight, width]
    );

    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    const selectedProjectOption =
        TVL_NAV_ITEMS.find((item) => item.value === selectedProjectType) ||
        TVL_NAV_ITEMS[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = TVL_NAV_ITEMS.find((item) => item.value === value);
        if (optionItem === undefined) {
            Logger.debug(
                "TvlModule::onTabOptionsChange: Nav option item not found"
            );
            return;
        }
        onChangeProjectType(optionItem.value);
    };

    if (isLoading) {
        return <ModuleLoader $height={`${LIST_HEIGHT}px`} />;
    }

    return (
        <div ref={squareRef}>
            <div className="relative p-0">
                <div className="px-2">
                    <TabsBar
                        options={TVL_NAV_ITEMS}
                        onChange={onTabOptionChange}
                        selectedOption={selectedProjectOption}
                    />
                </div>
                {projectsTvlData?.length !== 0 && width >= THRESHOLD && (
                    <TvlItemsHeader projectType={selectedProjectType} />
                )}
                <ul className="mt-0" style={{ height: `${LIST_HEIGHT}px` }}>
                    {projectsTvlData !== undefined &&
                    projectsTvlData?.length !== 0 ? (
                        <ScrollBar
                            className="pr-[3px] px-2"
                            onScroll={handleListScroll}
                        >
                            {projectsTvlData?.map((project, i) => (
                                <li
                                    className="flex items-center border-b border-borderLine cursor-pointer p-0 [&:nth-of-type(1)]:border-top-0"
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
                        <div className="flex w-full h-full justify-center items-center bg-background">
                            <p className="text-primary fontGroup-highlightSemi">
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
