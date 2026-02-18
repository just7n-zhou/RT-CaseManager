import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clauseUpdated } from "../store/clausesSlice";
import { makeSelectClauseById } from "../store/selectors";
import type { RootState } from "../store/store";

function expensiveWork(n: number) {
  let x = 0;
  for (let i = 0; i < 5000; i++) x += (i * n) % 97;
  return x;
}

function ClauseRowImpl({ id }: { id: string }) {
  const dispatch = useDispatch();
  const selectClause = useMemo(() => makeSelectClauseById(), []);
  const clause = useSelector((s: RootState) => selectClause(s, id));

  // Same simulated “deep logic”, but now only runs for the edited row (not all rows)
  expensiveWork(Number(id));

  if (!clause) return null;

  return (
    <div style={{ display: "flex", gap: 8, padding: "6px 0" }}>
      <div style={{ width: 90, color: "#666" }}>Clause {id}</div>
      <input
        style={{ flex: 1 }}
        value={clause.text}
        onChange={(e) => dispatch(clauseUpdated({ id, text: e.target.value }))}
      />
    </div>
  );
}

export const ClauseRow = React.memo(ClauseRowImpl);
