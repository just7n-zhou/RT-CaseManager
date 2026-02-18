import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Clause, Contract } from "../types";

type ClausesState = {
  byId: Record<string, Clause>;
  allIds: string[];
};

const initialState: ClausesState = { byId: {}, allIds: [] };

function makeClauses(contract: Contract, count: number): Clause[] {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1);
    return { id, text: `${contract.external_ref} - clause ${id}` };
  });
}

export const clausesSlice = createSlice({
  name: "clauses",
  initialState,
  reducers: {
    initClausesForContract: (
      state,
      action: PayloadAction<{ contract: Contract; count: number }>
    ) => {
      const items = makeClauses(action.payload.contract, action.payload.count);
      state.byId = {};
      state.allIds = [];
      for (const c of items) {
        state.byId[c.id] = c;
        state.allIds.push(c.id);
      }
    },

    clauseUpdated: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const c = state.byId[action.payload.id];
      if (c) c.text = action.payload.text;
    },
  },
});

export const { initClausesForContract, clauseUpdated } = clausesSlice.actions;
export default clausesSlice.reducer;
