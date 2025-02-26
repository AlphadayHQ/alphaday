import { FC } from "react";
import { ModuleLoader, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { TSocialItem } from "src/api/services";
import { TTweets } from "src/api/types";
import globalMessages from "src/globalMessages";
import TwitterFeedItem from "./TwitterFeedItem";

interface IPosts {
    posts: TSocialItem<TTweets>[];
    isLoading: boolean;
    handlePaginate: () => void;
    widgetHeight: number;
}

const TwitterFeedModule: FC<IPosts> = ({
    posts,
    handlePaginate,
    isLoading,
    widgetHeight,
}) => {
    if (isLoading) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    if (posts.length === 0) {
        return (
            <CenteredBlock>
                <p>{globalMessages.queries.noMatchFound("X posts")}</p>
            </CenteredBlock>
        );
    }

    return (
        <ScrollBar onScroll={handlePaginate}>
            {posts.map((post) => (
                <TwitterFeedItem key={post.id} {...post} />
            ))}
        </ScrollBar>
    );
};

export default TwitterFeedModule;
