import { configureStore } from "@reduxjs/toolkit";
import clauses from "./clausesSlice";
import editor from "./editorSlice";
import { autosaveMiddleware } from "./autosaveMiddleware";

export const store = configureStore({
  reducer: { clauses, editor },
  middleware: (getDefault) => getDefault().concat(autosaveMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
