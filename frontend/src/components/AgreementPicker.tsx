import { useEffect, useMemo, useState } from "react";
import { gql } from "../api/graphql";
import { GET_CASES_AND_CONTRACTS_SOLUTION } from "../api/queries";
import type { CaseRow, Contract } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { clauseCountChanged, contractSelected } from "../store/editorSlice";
import { initClausesForContract } from "../store/clausesSlice";
import type { RootState } from "../store/store";

type QueryResult = { cases: CaseRow[] };

export function AgreementPicker() {
  const dispatch = useDispatch();
  const clauseCount = useSelector((s: RootState) => s.editor.clauseCount);
  const active = useSelector((s: RootState) => s.editor.activeContract);

  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const contracts = useMemo(
    () => cases.flatMap((cs) => cs.contracts.map((c) => ({ ...c, _client: cs.client_name }))),
    [cases]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await gql<QueryResult>(GET_CASES_AND_CONTRACTS_SOLUTION);
        setCases(data.cases);

        const first = data.cases.find((x) => x.contracts.length)?.contracts[0];
        if (first) {
          dispatch(contractSelected(first));
          dispatch(initClausesForContract({ contract: first, count: clauseCount }));
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(contract: Contract) {
    dispatch(contractSelected(contract));
    dispatch(initClausesForContract({ contract, count: clauseCount }));
  }

  if (loading) return <div>Loading agreements from backend...</div>;
  if (error) return <div style={{ color: "crimson" }}>Error: {error}</div>;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <label>
        Clause count:
        <select
          value={clauseCount}
          onChange={(e) => {
            const n = Number(e.target.value);
            dispatch(clauseCountChanged(n));
            if (active) dispatch(initClausesForContract({ contract: active, count: n }));
          }}
          style={{ marginLeft: 8 }}
        >
          <option value={500}>500</option>
          <option value={1500}>1500</option>
          <option value={3000}>3000</option>
        </select>
      </label>

      <label>
        Select agreement:
        <select
          style={{ marginLeft: 8, minWidth: 360 }}
          value={active?.id ?? ""}
          onChange={(e) => {
            const c = contracts.find((x) => x.id === e.target.value);
            if (c) pick(c);
          }}
        >
          {contracts.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c._client} — {c.external_ref} ({c.status}, source {c.source_system})
            </option>
          ))}
        </select>
      </label>

      <span style={{ color: "#666" }}>
        Solution: normalized store + memoized selectors → only edited row rerenders.
      </span>
    </div>
  );
}
