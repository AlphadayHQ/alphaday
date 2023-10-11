import { FC } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { TLensPost } from "src/api/types";
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
}) =>
    isLoading ? (
        <ModuleLoader $height={`${widgetHeight}px`} />
    ) : (
        <ScrollBar onScroll={handlePaginate}>
            {posts.map((post) => (
                <LensFeedItem key={post.hash} {...post} />
            ))}
        </ScrollBar>
    );

export default LensFeedModule;
