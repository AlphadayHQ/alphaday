import { EItemsSortBy } from "../services";
import { translateLabels } from "./translationUtils";

export const SORT_OPTIONS: {
    label: string;
    value: EItemsSortBy;
}[] = [
    {
        value: EItemsSortBy.Name,
        label: translateLabels("(A-Z)"),
    },
    {
        value: EItemsSortBy.Popular,
        label: translateLabels("Popular"),
    },
    {
        value: EItemsSortBy.New,
        label: translateLabels("New"),
    },
];

export const getSortOptionValue = (value: string): EItemsSortBy | null => {
    const option = SORT_OPTIONS.find((op) => op.value === value);
    if (!option) {
        return null;
    }
    return option.value;
};
