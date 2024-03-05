import { FC, ReactNode } from "react";
import { Disclosure, Transition, twMerge } from "@alphaday/ui-kit";
import { EFeedItemType } from "src/api/types";
import { ReactComponent as CommentSVG } from "src/assets/svg/comment.svg";
import { ReactComponent as LikeSVG } from "src/assets/svg/like.svg";
import { ReactComponent as LikedSVG } from "src/assets/svg/liked.svg";
import { ReactComponent as ShareSVG } from "src/assets/svg/share.svg";
import { ActionButton, TagButton } from "src/mobile-components/button/buttons";
import { imgOnError } from "src/utils/errorHandling";
import { feedItemIconMap } from "./iconMap";

export const getFeedItemIcon = (type: EFeedItemType, isDown?: boolean) => {
    if (type === EFeedItemType.MARKET) {
        return feedItemIconMap[type]?.(!!isDown);
    }
    return feedItemIconMap[type];
};

export const ActionButtons: FC<{
    onLike: () => MaybeAsync<void>;
    onCommentClick: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
    likes: number;
    comments: number;
    isLiked: boolean;
}> = ({ onLike, onCommentClick, onShare, isLiked, likes, comments }) => (
    <div className="flex mt-2">
        <ActionButton onClick={onLike}>
            {isLiked ? (
                <LikedSVG className="w-3 h-3 pt-[1px]" />
            ) : (
                <LikeSVG className="w-3 h-3 pt-[1px]" />
            )}{" "}
            <span className="ml-0.5">{likes}</span>
        </ActionButton>
        <ActionButton onClick={onCommentClick}>
            <CommentSVG className="w-3 h-3 pt-[1px]" />
            <span className="ml-0.5">{comments}</span>
        </ActionButton>
        <ActionButton onClick={onShare}>
            <ShareSVG className="w-3 h-3 pt-[1px]" />
        </ActionButton>
    </div>
);

export const DisclosureButtonMedia: FC<{
    img: string | undefined;
}> = ({ img }) => (
    <img
        src={img}
        alt=""
        className="w-full h-24 rounded-lg object-cover"
        onError={imgOnError}
    />
);

export const TagButtons: FC<{
    tags: { name: string; slug: string }[];
    onClick: (tag: { name: string; slug: string }) => void;
    truncated?: boolean;
}> = ({ tags, onClick, truncated = false }) => (
    <div className="mt-2.5 flex flex-wrap">
        {tags.slice(0, truncated ? 3 : undefined).map((tag) => (
            <TagButton
                key={tag.slug}
                name={tag.name}
                slug={tag.slug}
                onClick={() => onClick(tag)}
            />
        ))}
    </div>
);

export const FeedItemDisclosure: FC<{
    children: ({ open }: { open: boolean }) => JSX.Element;
}> = ({ children }) => {
    return (
        <div className="border-b border-borderLine">
            <Disclosure>{({ open }) => children({ open })}</Disclosure>
        </div>
    );
};

export const FeedSourceInfo = ({
    name,
    img,
}: {
    name: string;
    img: string;
}) => {
    return (
        <span>
            <span className="capitalize">{name}</span>
            <img
                src={img}
                alt=""
                className="w-3.5 h-3.5 mr-[5px] rounded-full inline-flex ml-1.5"
                onError={imgOnError}
            />
        </span>
    );
};

export const FeedItemDisclosureButton: FC<{
    open: boolean;
    children?: ReactNode;
}> = ({ open, children }) => {
    return (
        <Disclosure.Button
            className={twMerge(
                "flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium focus:outline-none cursor-pointer",
                open ? "" : "mb-2"
            )}
        >
            {children}
        </Disclosure.Button>
    );
};

export const FeedItemDisclosureButtonImage: FC<{
    icon: string;
}> = ({ icon }) => {
    return <img src={icon} alt="feed icon" className="w-8 h-8 mr-1" />;
};

export const CardTitle: FC<{ title: string }> = ({ title }) => (
    <p className="mt-2 mb-0 fontGroup-highlight line-clamp-3">{title}</p>
);

export const FeedItemDisclosurePanel: FC<{
    children: ReactNode;
}> = ({ children }) => {
    return (
        <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Disclosure.Panel className="pt-2 text-primaryVariant100  fontGroup-normal">
                {children}
            </Disclosure.Panel>
        </Transition>
    );
};
