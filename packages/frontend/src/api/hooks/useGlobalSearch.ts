import {
    setViewKeywords,
    addKeywordToViewWidgets as addKeywordToViewWidgetsInStore,
    removeTagFromAllWidgets,
    keywordSearchListSelector,
    lastSelectedKeywordSelector,
    setLastSelectedKeyword as setLastSelectedKeywordInStore,
    removeKeywordsFromViewWidgets as removeKeywordsFromViewWidgetsInStore,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TKeyword } from "src/api/types";
import { Logger } from "src/api/utils/logging";

interface IGlobalSearch {
    keywordSearchList: TKeyword[];
    setKeywordSearchList: (keywords: TKeyword[]) => void;
    addKeywordToViewWidgets: (keyword: TKeyword) => void;
    removeKeywordsFromViewWidgets: (keywords: TKeyword[]) => void;
    removeTag: (tagId: number) => void;
    lastSelectedKeyword: TKeyword | undefined;
    setLastSelectedKeyword: (keyword: TKeyword | undefined) => void;
}

/**
 * useGlobalSearch.
 * This hook is used in the global search bar only.
 * It is used to search for keywords, display them and add them to the view or remove them.
 * It also stores the last selected keyword and as well add keywords to view's widgets.
 *
 * @returns - Keywords in the store and utils to manipulate them
 */
export const useGlobalSearch: () => IGlobalSearch = () => {
    const dispatch = useAppDispatch();

    const keywordSearchList = useAppSelector(keywordSearchListSelector);

    const setKeywordSearchList = (keywords: TKeyword[]) => {
        Logger.debug(
            "useGlobalSearch: dispatching setKeywordSearchList",
            keywords
        );
        dispatch(setViewKeywords(keywords));
    };

    const addKeywordToViewWidgets = (keyword: TKeyword) => {
        Logger.debug(
            "useGlobalSearch: dispatching addKeywordToViewWidgets",
            keyword
        );
        dispatch(addKeywordToViewWidgetsInStore(keyword));
    };

    const removeKeywordsFromViewWidgets = (keywords: TKeyword[]) => {
        Logger.debug(
            "useGlobalSearch: dispatching removeKeywordsFromViewWidgets",
            keywords
        );
        dispatch(removeKeywordsFromViewWidgetsInStore(keywords));
    };

    const removeTag = (tagId: number) => {
        Logger.debug("useGlobalSearch: dispatching removeTag", tagId);
        dispatch(removeTagFromAllWidgets({ tagId }));
    };

    const lastSelectedKeyword = useAppSelector(lastSelectedKeywordSelector);

    const setLastSelectedKeyword = (keyword: TKeyword | undefined) => {
        dispatch(setLastSelectedKeywordInStore(keyword));
    };

    return {
        keywordSearchList,
        setKeywordSearchList,
        addKeywordToViewWidgets,
        removeKeywordsFromViewWidgets,
        removeTag,
        lastSelectedKeyword,
        setLastSelectedKeyword,
    };
};
