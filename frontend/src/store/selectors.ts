import { createSelector } from "reselect";
import type { RootState } from "./store";

export const selectClauseIds = (s: RootState) => s.clauses.allIds;
export const selectClauseByIdMap = (s: RootState) => s.clauses.byId;
export const selectActiveContract = (s: RootState) => s.editor.activeContract;
export const selectClauseCount = (s: RootState) => s.editor.clauseCount;

// Factory selector: each row gets its own memoized selector instance
export const makeSelectClauseById = () =>
  createSelector(
    [selectClauseByIdMap, (_: RootState, id: string) => id],
    (byId, id) => byId[id]
  );
