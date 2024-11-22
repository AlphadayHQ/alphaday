import i18next from "i18next";
import { TEventCategory } from "./types";

export const typeOptions: { value: string; name: string; color: string }[] = [
    {
        value: "Co",
        name: i18next.t("calendar.event_types.conferences"),
        color: "rgb(185, 225, 135)",
    },
    {
        value: "MU",
        name: i18next.t("calendar.event_types.meetups"),
        color: "rgb(117, 71, 247)",
    },
    {
        value: "Hk",
        name: i18next.t("calendar.event_types.hackathons"),
        color: "rgb(162, 117, 84)",
    },
    {
        value: "PR",
        name: i18next.t("calendar.event_types.product_releases"),
        color: "rgb(249, 132, 104)",
    },
    {
        value: "DC",
        name: i18next.t("calendar.event_types.developer_conferences"),
        color: "rgb(224, 135, 135)",
    },
    {
        value: "ICO",
        name: i18next.t("calendar.event_types.icos"),
        color: "rgb(144, 190, 109)",
    },
    {
        value: "IDO",
        name: i18next.t("calendar.event_types.idos"),
        color: "rgb(67, 170, 139)",
    },
    {
        value: "DV",
        name: i18next.t("calendar.event_types.dev_updates"),
        color: "rgb(77, 144, 142)",
    },
    {
        value: "EE",
        name: i18next.t("calendar.event_types.exchange_events"),
        color: "rgb(87, 117, 144)",
    },
    {
        value: "CC",
        name: i18next.t("calendar.event_types.community_calls"),
        color: "rgb(39, 125, 161)",
    },
    {
        value: "SF",
        name: i18next.t("calendar.event_types.soft_forks"),
        color: "rgb(253, 153, 153)",
    },
    {
        value: "HF",
        name: i18next.t("calendar.event_types.hard_forks"),
        color: "rgb(198, 179, 14)",
    },
    {
        value: "EDU",
        name: i18next.t("calendar.event_types.education"),
        color: "rgb(71, 127, 247)",
    },
    {
        value: "INT",
        name: i18next.t("calendar.event_types.interviews"),
        color: "rgb(17, 157, 164)",
    },
    {
        value: "PY",
        name: i18next.t("calendar.event_types.partnerships"),
        color: "rgb(216, 227, 118)",
    },
    {
        value: "WK",
        name: i18next.t("calendar.event_types.workshops"),
        color: "rgb(126, 74, 15)",
    },
    {
        value: "Unfiltered",
        name: i18next.t("calendar.event_types.unfiltered"),
        color: "rgb(17, 78, 198)",
    },
];

export const defaultEventCategory: TEventCategory = {
    value: "Unfiltered",
    label: i18next.t("calendar.event_types.unfiltered"),
    category: "Unfiltered",
    color: "rgb(17, 78, 198)",
};

export const viewableCategories = typeOptions.filter(
    (cat) =>
        cat.value.toLowerCase() !== defaultEventCategory.value.toLowerCase()
); // hide unfiltered events
