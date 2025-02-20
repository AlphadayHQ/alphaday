import i18next from "i18next";
import { TEventCategory } from "./types";

export const typeOptions: { value: string; name: string; color: string }[] = [
    {
        value: "Co",
        name: i18next.t("calendar.eventTypes.conferences"),
        color: "rgb(185, 225, 135)",
    },
    {
        value: "MU",
        name: i18next.t("calendar.eventTypes.meetups"),
        color: "rgb(117, 71, 247)",
    },
    {
        value: "Hk",
        name: i18next.t("calendar.eventTypes.hackathons"),
        color: "rgb(162, 117, 84)",
    },
    {
        value: "PR",
        name: i18next.t("calendar.eventTypes.productReleases"),
        color: "rgb(249, 132, 104)",
    },
    {
        value: "DC",
        name: i18next.t("calendar.eventTypes.developer_conferences"),
        color: "rgb(224, 135, 135)",
    },
    {
        value: "ICO",
        name: i18next.t("calendar.eventTypes.icos"),
        color: "rgb(144, 190, 109)",
    },
    {
        value: "IDO",
        name: i18next.t("calendar.eventTypes.idos"),
        color: "rgb(67, 170, 139)",
    },
    {
        value: "DV",
        name: i18next.t("calendar.eventTypes.dev_updates"),
        color: "rgb(77, 144, 142)",
    },
    {
        value: "EE",
        name: i18next.t("calendar.eventTypes.exchange_events"),
        color: "rgb(87, 117, 144)",
    },
    {
        value: "CC",
        name: i18next.t("calendar.eventTypes.communityCalls"),
        color: "rgb(39, 125, 161)",
    },
    {
        value: "SF",
        name: i18next.t("calendar.eventTypes.softForks"),
        color: "rgb(253, 153, 153)",
    },
    {
        value: "HF",
        name: i18next.t("calendar.eventTypes.hardForks"),
        color: "rgb(198, 179, 14)",
    },
    {
        value: "EDU",
        name: i18next.t("calendar.eventTypes.education"),
        color: "rgb(71, 127, 247)",
    },
    {
        value: "INT",
        name: i18next.t("calendar.eventTypes.interviews"),
        color: "rgb(17, 157, 164)",
    },
    {
        value: "PY",
        name: i18next.t("calendar.eventTypes.partnerships"),
        color: "rgb(216, 227, 118)",
    },
    {
        value: "WK",
        name: i18next.t("calendar.eventTypes.workshops"),
        color: "rgb(126, 74, 15)",
    },
    {
        value: "Unfiltered",
        name: i18next.t("calendar.eventTypes.unfiltered"),
        color: "rgb(17, 78, 198)",
    },
];

export const defaultEventCategory: TEventCategory = {
    value: "Unfiltered",
    label: i18next.t("calendar.eventTypes.unfiltered"),
    category: "Unfiltered",
    color: "rgb(17, 78, 198)",
};

export const viewableCategories = typeOptions.filter(
    (cat) =>
        cat.value.toLowerCase() !== defaultEventCategory.value.toLowerCase()
); // hide unfiltered events
