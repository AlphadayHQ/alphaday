import { TEventCategory } from "./types";

export const typeOptions: { value: string; name: string; color: string }[] = [
    {
        value: "Co",
        name: "Conferences",
        color: "rgb(185, 225, 135)",
    },
    {
        value: "MU",
        name: "Meetups",
        color: "rgb(117, 71, 247)",
    },
    {
        value: "Hk",
        name: "Hackathons",
        color: "rgb(162, 117, 84)",
    },
    {
        value: "PR",
        name: "Product Releases",
        color: "rgb(249, 132, 104)",
    },
    {
        value: "DC",
        name: "Dev Calls",
        color: "rgb(224, 135, 135)",
    },
    {
        value: "ICO",
        name: "Initial Coin Offerings",
        color: "rgb(144, 190, 109)",
    },
    {
        value: "IDO",
        name: "Initial Dex Offerings",
        color: "rgb(67, 170, 139)",
    },
    {
        value: "DV",
        name: "DAO Votes",
        color: "rgb(77, 144, 142)",
    },
    {
        value: "EE",
        name: "Economic Events",
        color: "rgb(87, 117, 144)",
    },
    {
        value: "CC",
        name: "Community Calls",
        color: "rgb(39, 125, 161)",
    },
    {
        value: "SF",
        name: "Soft Forks",
        color: "rgb(253, 153, 153)",
    },
    {
        value: "HF",
        name: "Hard Forks",
        color: "rgb(198, 179, 14)",
    },
    {
        value: "EDU",
        name: "Education & Learning",
        color: "rgb(71, 127, 247)",
    },
    {
        value: "INT",
        name: "Interviews",
        color: "rgb(17, 157, 164)",
    },
    {
        value: "PY",
        name: "Partys",
        color: "rgb(216, 227, 118)",
    },
    {
        value: "WK",
        name: "Workshops",
        color: "rgb(126, 74, 15)",
    },
    {
        value: "Unfiltered",
        name: "Unfiltered",
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
