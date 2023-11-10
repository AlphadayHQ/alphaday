import { TEventCategory } from "./types";

export const typeOptions: { value: string; color: string }[] = [
    {
        value: "Co",
        color: "rgb(185, 225, 135)",
    },
    {
        value: "MU",
        color: "rgb(117, 71, 247)",
    },
    {
        value: "Hk",
        color: "rgb(162, 117, 84)",
    },
    {
        value: "PR",
        color: "rgb(249, 132, 104)",
    },
    {
        value: "DC",
        color: "rgb(224, 135, 135)",
    },
    {
        value: "ICO",
        color: "rgb(144, 190, 109)",
    },
    {
        value: "IDO",
        color: "rgb(67, 170, 139)",
    },
    {
        value: "DV",
        color: "rgb(77, 144, 142)",
    },
    {
        value: "EE",
        color: "rgb(87, 117, 144)",
    },
    {
        value: "CC",
        color: "rgb(39, 125, 161)",
    },
    {
        value: "SF",
        color: "rgb(253, 153, 153)",
    },
    {
        value: "HF",
        color: "rgb(198, 179, 14)",
    },
    {
        value: "EDU",
        color: "rgb(71, 127, 247)",
    },
    {
        value: "INT",
        color: "rgb(17, 157, 164)",
    },
    {
        value: "PY",
        color: "rgb(216, 227, 118)",
    },
    {
        value: "WK",
        color: "rgb(126, 74, 15)",
    },
    {
        value: "Unfiltered",
        color: "rgb(17, 78, 198)",
    },
];

export const defaultEventCategory: TEventCategory = {
    value: "Unfiltered",
    label: "Unfiltered",
    category: "Unfiltered",
    color: "rgb(17, 78, 198)",
};

export const viewableCategories = typeOptions.filter(
    (cat) =>
        cat.value.toLowerCase() !== defaultEventCategory.value.toLowerCase()
); // hide unfiltered events
