import {
    TTag,
    TGroupedFilterKeywords,
    TFilterKeywordOptionGroup,
    GROUP_NAME_MAP,
} from "src/api/types";
import { TBaseTag } from "../services";

export const tagsInclude: (tagList: TTag[], tag: TTag) => boolean = (
    tagList,
    tag
) => {
    if (tagList.length === 0) return false;
    return tagList.map((t: TTag): number => t.id).includes(tag.id);
};

/**
 * Transforms an array of tags into a string of comma-separated tags
 * @param filters An array of any object extending { slug: string }
 * @returns string
 */
export const filteringListToStr: <T extends { slug: string }>(
    filters: T[]
) => string = (filters) => filters.map((t) => t.slug).join(",");

export const mapRemoteTags: (rawTags: TBaseTag[]) => TTag[] = (rawTags) =>
    rawTags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        tagType: t.tag_type,
    }));

export const groupedKeywordsAsOptions = (
    filterKeywords: TGroupedFilterKeywords | undefined
) => {
    if (!filterKeywords) return [];
    return Object.entries(filterKeywords)
        .reduce(
            (acc, [currKey, currVal]) => [
                ...acc,
                {
                    label: GROUP_NAME_MAP[currKey] ?? currKey,
                    options: currVal.map((kw) => ({
                        ...kw,
                        label: kw.name,
                        value: kw.slug,
                    })),
                },
            ],
            [] as TFilterKeywordOptionGroup[]
        )
        .sort((a, d) => a.label.localeCompare(d.label));
};
