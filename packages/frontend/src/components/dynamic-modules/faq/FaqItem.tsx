import { FC } from "react";
import { CollapseListItem } from "@alphaday/ui-kit";
import { REMARK_URL_REGEX, remarkRegex } from "src/api/utils/textUtils";
import { TItem } from "src/types";
import { useDynamicWidgetItem } from "../hooks/useDynamicWidgetItem";

const PLUGINS = [remarkRegex(REMARK_URL_REGEX)];

interface IItem {
    item: TItem;
    setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
}

const FaqItem: FC<IItem> = ({ item, setItemsHeight }) => {
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight });
    const { name, description } = item;

    return (
        <div
            tabIndex={0}
            title="Open/close details"
            role="button"
            onClick={toggleAccordion}
            className="list-group-item flex flex-row items-start p-[14px] w-full bg-background pb-0 pt-5 cursor-pointer flex-grow hover:bg-background duration-200 ease-[ease] border-b border-borderLine active:bg-background [&:nth-of-type(1)]:pt-[30px] [&:nth-of-type(1)>.line]:-bottom-3 [&:nth-of-type(1)>.line]:h-full [&:nth-of-type(1)>.line]:top-auto"
        >
            <CollapseListItem
                title={name}
                openAccordion={openAccordion}
                descHeightRef={descHeightRef}
                description={description}
                variant="faq"
                fullHeight={descHeight}
                remarkPlugins={PLUGINS}
            />
        </div>
    );
};

export default FaqItem;
