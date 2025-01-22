import { FormEvent, FC } from "react";
import {
    HRElement,
    ListItem,
    CenteredBlock,
    ScrollBar,
} from "@alphaday/ui-kit";
import { TDaoItem } from "src/api/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";

interface IDaoItemList {
    items: TDaoItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
}
const DaoItemList: FC<IDaoItemList> = ({ items, handlePaginate }) => {
    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };
    if (items) {
        if (items.length === 0) {
            return (
                <CenteredBlock>
                    <p>{globalMessages.queries.noMatchFound("items")}</p>
                </CenteredBlock>
            );
        }
        return (
            <ScrollBar onScroll={handleListScroll}>
                {items.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            variant="dao"
                            title={item.title}
                            path={item.url}
                            duration={computeDuration(item.startsAt)}
                            tag={item.sourceName}
                            tagImg={item.sourceIcon}
                        />
                    );
                })}
            </ScrollBar>
        );
    }
    return (
        <>
            {Array.from(Array(8), Math.random).map((item) => {
                return (
                    <span key={item}>
                        <HRElement />
                    </span>
                );
            })}
        </>
    );
};

export default DaoItemList;
