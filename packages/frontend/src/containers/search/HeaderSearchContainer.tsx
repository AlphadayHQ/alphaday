import { FC } from "react";
import { SearchBar } from "@alphaday/ui-kit";
import { ActionMeta } from "react-select";
import { useGlobalSearch } from "src/api/hooks";
import { useKeywordSearch } from "src/api/hooks/useKeywordSearch";
import { useTutorial } from "src/api/hooks/useTutorial";
import { ETag, useUpdateKeywordFreqMutation } from "src/api/services";
import { ETutorialTipId, TKeyword } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";

type TOption = {
    id: number;
    label: string;
    value: string;
    tag: {
        id: number;
        name: string;
        slug: string;
        tagType: ETag;
    };
};

type TOptions = ReadonlyArray<TOption>;

const HeaderSearchContainer: FC = () => {
    const {
        keywordSearchList,
        setKeywordSearchList,
        addKeywordToViewWidgets,
        removeKeywordsFromViewWidgets,
        removeTag,
        lastSelectedKeyword,
        setLastSelectedKeyword,
    } = useGlobalSearch();
    const {
        keywordResults,
        trendingKeywordResults,
        setSearchState,
        isFetchingKeywordResults,
        isFetchingTrendingKeywordResults,
    } = useKeywordSearch();

    const [updateKeywordFreq] = useUpdateKeywordFreqMutation({});
    const { currentTutorial, setTutFocusElemRef } = useTutorial();

    const handleChange = (
        rawKeywords: TOptions,
        actionType: ActionMeta<TOption>
    ) => {
        if (actionType.action === "clear") {
            removeKeywordsFromViewWidgets([...keywordSearchList]);
            setKeywordSearchList([]);
            return;
        }
        if (rawKeywords != null) {
            const selectedKeywords: TKeyword[] = rawKeywords.map(
                (keyword: TOption) => ({
                    id: parseInt(keyword.value, 10),
                    name: keyword.label,
                    tag: {
                        ...keyword.tag,
                    },
                })
            );

            const newSelectedKeyword: TKeyword | undefined =
                selectedKeywords.find(
                    (e: TKeyword) =>
                        !keywordSearchList.find((t) => t.id === e.id)
                );

            /**
             * we may have a new keyword but this keyword may contain
             * a tag that's already in an existing keyword, in which case
             * we shouldn't add it to the state.
             * (Notice that this shouldn't happen because search results are
             * filtered so that existing tag keywords are ignored)
             */
            const newTagInKeyword = newSelectedKeyword
                ? keywordSearchList.length === 0 ||
                  !keywordSearchList.find(
                      (existingKey) =>
                          existingKey.tag.id === newSelectedKeyword.tag.id
                  )
                : false;

            let removedKeyword;
            if (selectedKeywords.length === 0 && lastSelectedKeyword) {
                removedKeyword = lastSelectedKeyword;
            } else {
                removedKeyword = keywordSearchList.find(
                    (e: TKeyword) =>
                        !selectedKeywords.find((t) => t.id === e.id)
                );
            }
            if (removedKeyword) {
                removeTag(removedKeyword.tag.id);
            }

            setLastSelectedKeyword(newSelectedKeyword);

            if (newSelectedKeyword) {
                updateKeywordFreq({
                    name: newSelectedKeyword.name,
                })
                    .unwrap()
                    .then((resp) =>
                        Logger.debug(
                            "HeaderSearchContainer::handleChange: updating keyword Frequency",
                            resp
                        )
                    )
                    .catch((err) =>
                        Logger.error(
                            "HeaderSearchContainer::handleChange: updating keyword Frequency",
                            err
                        )
                    );
            }

            if (removedKeyword || newTagInKeyword) {
                setKeywordSearchList(selectedKeywords);
            }
            if (newSelectedKeyword && newTagInKeyword) {
                addKeywordToViewWidgets(newSelectedKeyword);
            }
        }
    };

    // only include keywords for tags that haven't been selected already
    const filteredResults =
        keywordResults === undefined
            ? []
            : keywordResults
                  .map((keyword) => ({
                      id: keyword.id,
                      label: keyword.name,
                      value: String(keyword.id),
                      tag: {
                          id: keyword.tag.id,
                          name: keyword.tag.name,
                          slug: keyword.tag.slug,
                          tagType: keyword.tag.tagType,
                      },
                  }))
                  .filter((kwResult) => {
                      if (keywordSearchList.length === 0) return true;
                      return !keywordSearchList.find(
                          (kwInState) => kwResult.tag.id === kwInState.tag.id
                      );
                  });

    const trendingResults = trendingKeywordResults?.map((keyword) => ({
        id: keyword.id,
        label: keyword.name,
        value: String(keyword.id),
        tag: {
            id: keyword.tag.id,
            name: keyword.tag.name,
            slug: keyword.tag.slug,
            tagType: keyword.tag.tagType,
        },
    }));

    return (
        <div
            className="two-col:mx-2.5 two-col:my-auto three-col:m-auto flex w-full justify-center"
            data-testid="header-search-container"
        >
            <span
                className="w-full max-w-[524px]"
                ref={(ref) =>
                    currentTutorial.tip?.id === ETutorialTipId.UseSeachBar &&
                    ref &&
                    setTutFocusElemRef &&
                    setTutFocusElemRef(ref)
                }
            >
                <SearchBar<TOption>
                    showBackdrop
                    onChange={handleChange}
                    onInputChange={debounce((e: string) => {
                        setSearchState(e);
                    }, 500)}
                    placeholder="Search for assets, projects, events, etc."
                    initialSearchValues={
                        keywordSearchList === undefined
                            ? []
                            : keywordSearchList.map((keyword) => ({
                                  id: keyword.id,
                                  label: keyword.name,
                                  value: String(keyword.id),
                                  tag: {
                                      id: keyword.tag.id,
                                      name: keyword.tag.name,
                                      slug: keyword.tag.slug,
                                      tagType: keyword.tag.tagType,
                                  },
                              }))
                    }
                    options={filteredResults}
                    trendingOptions={trendingResults}
                    isFetchingKeywordResults={isFetchingKeywordResults}
                    isFetchingTrendingKeywordResults={
                        isFetchingTrendingKeywordResults
                    }
                />
            </span>
        </div>
    );
};

export default HeaderSearchContainer;
