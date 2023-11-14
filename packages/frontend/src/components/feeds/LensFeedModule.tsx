import { FC } from "react";
import { ModuleLoader, NoItems, ScrollBar } from "@alphaday/ui-kit";
import { TLensPost } from "src/api/types";
import globalMessages from "src/globalMessages";
import LensFeedItem from "./LensFeedItem";

interface IPosts {
    posts: TLensPost[];
    isLoading: boolean;
    handlePaginate: () => void;
    widgetHeight: number;
}
const LensFeedModule: FC<IPosts> = ({
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
            <NoItems>
                <p>{globalMessages.queries.noMatchFound("lens posts")}</p>
            </NoItems>
        );
    }
    return (
        <ScrollBar onScroll={handlePaginate}>
            {posts.map((post) => (
                <LensFeedItem key={post.hash} {...post} />
            ))}
        </ScrollBar>
    );
};

export default LensFeedModule;
