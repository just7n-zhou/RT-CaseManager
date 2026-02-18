import type { Middleware } from "@reduxjs/toolkit";
import { clauseUpdated } from "./clausesSlice";

export const autosaveMiddleware: Middleware = (store) => {
  let t: number | undefined;

  return (next) => (action) => {
    const result = next(action);

    if (clauseUpdated.match(action)) {
      // debounce autosave
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        const state = store.getState() as any;
        const contract = state.editor.activeContract;
        if (!contract) return;

        // Educational mock: async "save" without blocking UI
        // (In real app: call a GraphQL mutation here)
        console.log("[autosave] contract:", contract.id, "clause:", action.payload.id);
      }, 400);
    }

    return result;
  };
};
