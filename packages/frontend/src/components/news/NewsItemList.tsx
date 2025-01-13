import { FormEvent, FC } from "react";
import {
    HRElement,
    ListItem,
    CenteredBlock,
    ScrollBar,
} from "@alphaday/ui-kit";
import { TNewsItem } from "src/api/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";

interface INewsItemList {
    items: TNewsItem[] | undefined;
    handlePaginate: (type: "next" | "previous") => void;
    onClick?: (id: number) => MaybeAsync<void>;
    onBookmark?: (id: TNewsItem) => MaybeAsync<void>;
    isAuthenticated?: boolean;
}
const NewsItemList: FC<INewsItemList> = ({
    items,
    handlePaginate,
    onClick,
    onBookmark,
    isAuthenticated,
}) => {
    const handleListScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };
    if (items) {
        if (items.length === 0) {
            return (
                <CenteredBlock>
                    <p>{globalMessages.queries.noMatchFound("news")}</p>
                </CenteredBlock>
            );
        }
        return (
            <ScrollBar onScroll={handleListScroll}>
                {items.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            variant="news"
                            title={item.title}
                            path={item.url}
                            duration={computeDuration(item.publishedAt)}
                            tag={item.sourceName}
                            tagImg={item.sourceIcon}
                            source={item.author}
                            bookmarked={item.bookmarked}
                            onClick={async () => {
                                if (onClick !== undefined) {
                                    await onClick(item.id);
                                }
                            }}
                            onBookmark={async () => {
                                if (onBookmark !== undefined) {
                                    await onBookmark(item);
                                }
                            }}
                            isAuthenticated={isAuthenticated}
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

export default NewsItemList;
