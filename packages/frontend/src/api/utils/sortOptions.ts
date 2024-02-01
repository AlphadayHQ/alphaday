import { EItemsSortBy } from "../services";

const SORT_OPTIONS: {
    label: string;
    value: EItemsSortBy;
}[] = [
    {
        label: "(A-Z)",
        value: EItemsSortBy.Name,
    },
    {
        label: "Popular",
        value: EItemsSortBy.Popular,
    },
    {
        label: "New",
        value: EItemsSortBy.New,
    },
];

export const getSortOptionsArray = (): string[] => {
    return SORT_OPTIONS.map((option) => option.label);
};

export const getSortOptionValue = (label: string): EItemsSortBy | null => {
    const option = SORT_OPTIONS.find((op) => op.label === label);
    if (!option) {
        return null;
    }
    return option.value;
};
