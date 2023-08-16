import { FC, FormEvent } from "react";
import { CardBody } from "@doar/components";
import { TDiscordItem } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import globalMessages from "src/globalMessages";
import { StyledNoItems } from "../common/Items.style";
import ModuleLoader from "../moduleLoader";
import { StyledList } from "../news/NewsModule.style";
import ScrollBar from "../scrollbar";
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
        <ModuleLoader height={`${String(widgetHeight)}px`} />
    ) : (
        <CardBody p={["0px", "0px"]}>
            <StyledList $height={widgetHeight}>
                <ScrollBar onScroll={handleDiscordListScroll}>
                    {items.map((item) => {
                        return <DiscordFeedItem key={item.id} item={item} />;
                    })}
                    {!isLoadingItems && items.length === 0 && (
                        <StyledNoItems>
                            <p>
                                {globalMessages.queries.noMatchFound(
                                    "Discord Items"
                                )}
                            </p>
                        </StyledNoItems>
                    )}
                </ScrollBar>
            </StyledList>
        </CardBody>
    );
};

export default DiscordModule;
