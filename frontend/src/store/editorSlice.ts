import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Contract } from "../types";

type EditorState = {
  activeContract: Contract | null;
  clauseCount: number;
};

const initialState: EditorState = { activeContract: null, clauseCount: 1500 };

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    contractSelected: (state, action: PayloadAction<Contract>) => {
      state.activeContract = action.payload;
    },
    clauseCountChanged: (state, action: PayloadAction<number>) => {
      state.clauseCount = action.payload;
    },
  },
});

export const { contractSelected, clauseCountChanged } = editorSlice.actions;
export default editorSlice.reducer;
