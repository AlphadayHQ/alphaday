import { FormEvent, FC } from "react";
import { HRElement, ListItem, NoItems, ScrollBar } from "@alphaday/ui-kit";
import { TDaoItem } from "src/api/types";
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
                <NoItems>
                    <p>{globalMessages.queries.noMatchFound("Items")}</p>
                </NoItems>
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
                            date={item.startsAt}
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
