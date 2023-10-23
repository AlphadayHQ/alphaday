import { FC } from "react";
import { CollapseListItem } from "@alphaday/ui-kit";
import { TItem } from "src/types";
import { useDynamicWidgetItem } from "../hooks/useDynamicWidgetItem";

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
            className="flex flex-row items-start p-[14px] w-full bg-backgroundVariant800 border-none pb-0 pt-5 cursor-pointer flex-grow hover:bg-backgroundVariant900 duration-200 ease-in-out hover:[&_.right]:border hover:[&_.right]:border-backgroundVariant900 active:bg-backgroundVariant1000"
        >
            <div className="flex">
                <CollapseListItem
                    title={name}
                    openAccordion={openAccordion}
                    descHeightRef={descHeightRef}
                    description={description}
                    variant="faq"
                    fullHeight={descHeight}
                />
            </div>
        </div>
    );
};

export default FaqItem;
