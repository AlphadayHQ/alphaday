import { FC } from "react";
import { TLensPost } from "src/api/types";
import ModuleLoader from "src/components/moduleLoader";
import ScrollBar from "src/components/scrollbar";
import { StyledTweetContainer } from "../twitter-feed/TwitterFeedModule.style";
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
        <ModuleLoader height={`${widgetHeight}px`} />
    ) : (
        <StyledTweetContainer $height={widgetHeight}>
            <ScrollBar onScroll={handlePaginate}>
                {posts.map((post) => (
                    <LensFeedItem key={post.hash} {...post} />
                ))}
            </ScrollBar>
        </StyledTweetContainer>
    );

export default LensFeedModule;
