import { FC } from "react";
import { useWidgetHeight } from "src/api/hooks";
import FaqModule from "src/components/dynamic-modules/faq/FaqModule";
import { IModuleContainer, TItem } from "src/types";

const FaqContainer: FC<IModuleContainer<TItem[][]>> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);
    const items = moduleData.widget.format_structure.data?.[0] || [];

    return (
        <FaqModule
            widgetHeight={widgetHeight}
            items={items}
            onAdjustWidgetHeight={() => {}}
        />
    );
};

export default FaqContainer;
