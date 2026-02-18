// frontend/src/components/AgreementPicker.tsx
import { useEffect, useMemo, useState } from "react";
import { gql } from "../api/graphql";
import { GET_CASES_AND_RAW_CONTRACTS } from "../api/queries";
import type { CaseRow, RawAgreement } from "../types";
import { useAgreement } from "../context/AgreementContext";

type QueryResult = { cases: CaseRow[] };

export function AgreementPicker() {
  const { setAgreementAndInitClauses } = useAgreement();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clauseCount, setClauseCount] = useState(1500);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await gql<QueryResult>(GET_CASES_AND_RAW_CONTRACTS);
        setCases(data.cases);

        // auto pick first available agreement
        const first = data.cases
          .flatMap((cs) => toAgreements(cs))
          .at(0);

        if (first) {
          setSelectedId(first.id);
          setAgreementAndInitClauses(first, clauseCount);
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agreements = useMemo(() => cases.flatMap((cs) => toAgreements(cs)), [cases]);

  function onSelect(id: string) {
    setSelectedId(id);
    const a = agreements.find((x) => x.id === id);
    if (a) setAgreementAndInitClauses(a, clauseCount);
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
            setClauseCount(n);
            const a = agreements.find((x) => x.id === selectedId);
            if (a) setAgreementAndInitClauses(a, n);
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
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {agreements.map((a) => (
            <option key={a.id} value={a.id}>
              {a.source} — {a.ref} ({a.status})
            </option>
          ))}
        </select>
      </label>

      <span style={{ color: "#666" }}>
        Problem backend: inconsistent fields → frontend has to deal with A vs B.
      </span>
    </div>
  );
}

// Convert one CaseRow into unified frontend “agreements”
function toAgreements(cs: CaseRow): RawAgreement[] {
  const a = cs.sourceAContracts.map((x) => ({
    id: `A::${x.id}`,
    source: "A" as const,
    ref: x.AgreementID,
    status: x.StatusText,
    renewal: x.RenewalDT ?? null,
  }));

  const b = cs.sourceBContracts.map((x) => ({
    id: `B::${x.id}`,
    source: "B" as const,
    ref: x.ContractRef,
    status: x.State,
    renewal: x.RenewalDate ?? null,
  }));

  return [...a, ...b];
}
