import { FC, FormEvent } from "react";
import { ModuleLoader, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { TDiscordItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import DiscordFeedItem from "./DiscordFeedItem";

interface IDiscord {
    isLoadingItems: boolean;
    items: TDiscordItem[];
    widgetHeight: number;
    handlePaginate: (type: "next" | "previous") => void;
}

const DiscordModule: FC<IDiscord> = ({
    items,
    isLoadingItems,
    widgetHeight,
    handlePaginate,
}) => {
    const handleDiscordListScroll = ({
        currentTarget,
    }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    return isLoadingItems || !items ? (
        <ModuleLoader $height={`${widgetHeight}px`} />
    ) : (
        <ScrollBar onScroll={handleDiscordListScroll}>
            {items.map((item) => {
                return <DiscordFeedItem key={item.id} item={item} />;
            })}
            {!isLoadingItems && items.length === 0 && (
                <CenteredBlock>
                    <p>
                        {globalMessages.queries.noMatchFound("Discord Items")}
                    </p>
                </CenteredBlock>
            )}
        </ScrollBar>
    );
};

export default DiscordModule;
