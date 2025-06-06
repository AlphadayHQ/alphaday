import { FC, FormEvent } from "react";
import {
    ModuleLoader,
    ScrollBar,
    ListItem,
    CenteredBlock,
} from "@alphaday/ui-kit";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import { IReports } from "./types";

const ReportsModule: FC<IReports> = ({
    items,
    isLoadingItems,
    handlePaginate,
    widgetHeight,
}) => {
    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };
    if (isLoadingItems) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }
    if (items.length === 0) {
        return (
            <CenteredBlock>
                <p>{globalMessages.queries.noMatchFound("reports")}</p>
            </CenteredBlock>
        );
    }
    return (
        <ScrollBar onScroll={handleScroll}>
            {items.map((item) => {
                return (
                    <ListItem
                        key={item.id}
                        variant="reports"
                        path={item.url}
                        duration={computeDuration(item.reported_at)}
                        title={item.name}
                        source={item.source_name}
                        tag={item.topic}
                        tagImg={item.source_url}
                    />
                );
            })}
        </ScrollBar>
    );
};

export default ReportsModule;
