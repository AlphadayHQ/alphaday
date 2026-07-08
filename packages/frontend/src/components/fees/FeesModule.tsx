import { FC, useMemo, memo } from "react";
import { ModuleLoader, ScrollBar, TabsBar } from "@alphaday/ui-kit";
import useElementSize from "src/api/hooks/useElementSize";
import { TFeesItem, TFeesMetric } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { translateLabels } from "src/api/utils/translationUtils";
import globalMessages from "src/globalMessages";
import { FeesItem, FeesItemsHeader } from "./FeesItem";

export enum EFeesItemPreference {
    Revenue = "revenue",
    Fees = "total",
}
interface IFees {
    isLoading: boolean;
    items: TFeesItem[] | undefined;
    attribution: string | undefined;
    widgetHeight: number;
    selectedMetric: TFeesMetric;
    onChangeMetric: (metric: EFeesItemPreference) => void;
}

const translateNavItems = () => [
    {
        label: translateLabels("Revenue"),
        value: EFeesItemPreference.Revenue,
    },
    {
        label: translateLabels("Fees"),
        value: EFeesItemPreference.Fees,
    },
];

const FeesModule: FC<IFees> = memo(function FeesModule({
    isLoading,
    items,
    attribution,
    widgetHeight,
    selectedMetric,
    onChangeMetric,
}) {
    const feesNavItems = translateNavItems();

    const [squareRef, { width }] = useElementSize();

    const THRESHOLD = 475;
    const SWITCH_HEIGHT = 38;
    const LIST_HEADER_HEIGHT = 28;
    const ATTRIBUTION_HEIGHT = 20;
    const LIST_HEIGHT = useMemo(
        () =>
            width >= THRESHOLD
                ? widgetHeight -
                  (SWITCH_HEIGHT + LIST_HEADER_HEIGHT + ATTRIBUTION_HEIGHT)
                : widgetHeight - (SWITCH_HEIGHT + ATTRIBUTION_HEIGHT),
        [widgetHeight, width]
    );

    const selectedMetricOption =
        feesNavItems.find((item) => item.value === selectedMetric) ||
        feesNavItems[0];

    const onTabOptionChange = (value: string) => {
        const optionItem = feesNavItems.find((item) => item.value === value);
        if (optionItem === undefined) {
            Logger.debug(
                "FeesModule::onTabOptionsChange: Nav option item not found"
            );
            return;
        }
        onChangeMetric(optionItem.value);
    };

    if (isLoading) {
        return <ModuleLoader $height={`${LIST_HEIGHT}px`} />;
    }

    return (
        <div ref={squareRef}>
            <div className="relative p-0">
                <div className="px-2">
                    <TabsBar
                        options={feesNavItems}
                        onChange={onTabOptionChange}
                        selectedOption={selectedMetricOption}
                    />
                </div>
                {items?.length !== 0 && width >= THRESHOLD && (
                    <FeesItemsHeader metric={selectedMetric} />
                )}
                <ul className="mt-0" style={{ height: `${LIST_HEIGHT}px` }}>
                    {items !== undefined && items?.length !== 0 ? (
                        <ScrollBar className="pr-[3px] px-2">
                            {items?.map((item, i) => (
                                <li
                                    className="flex items-center border-b border-borderLine p-0 [&:nth-of-type(1)]:border-top-0"
                                    key={item.id}
                                >
                                    <FeesItem item={item} index={i} />
                                </li>
                            ))}
                        </ScrollBar>
                    ) : (
                        <div className="flex w-full h-full justify-center items-center bg-background">
                            <p className="text-primary fontGroup-highlightSemi">
                                {globalMessages.queries.noMatchFound("fees")}
                            </p>
                        </div>
                    )}
                </ul>
                {attribution && (
                    <div className="flex justify-end px-4 py-0.5 fontGroup-mini text-primaryVariant100">
                        {attribution}
                    </div>
                )}
            </div>
        </div>
    );
});

export default FeesModule;
