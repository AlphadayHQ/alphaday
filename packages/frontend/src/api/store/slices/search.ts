import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/api/store/store";
import { TKeyword } from "src/api/types";

export interface ISearchState {
    lastSelectedKeyword: TKeyword | undefined;
}

const initialState: ISearchState = {
    lastSelectedKeyword: undefined,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setLastSelectedKeyword(
            draft,
            action: PayloadAction<TKeyword | undefined>
        ) {
            const { payload } = action;
            draft.lastSelectedKeyword = payload;
        },
    },
});

export const lastSelectedKeywordSelector = (
    state: RootState
): TKeyword | undefined => state.search.lastSelectedKeyword;

export const { setLastSelectedKeyword } = searchSlice.actions;
export default searchSlice.reducer;
