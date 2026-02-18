import { useEffect, useState } from "react";
import { gql } from "../api/graphql";
import { GET_CASES_AND_CONTRACTS } from "../api/queries";
import type { CaseRow, Contract } from "../types";
import { useAgreement } from "../context/AgreementContext";

type QueryResult = { cases: CaseRow[] };

export function AgreementPicker() {
  const { setContractAndInitClauses } = useAgreement();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clauseCount, setClauseCount] = useState(1500);
  const [selected, setSelected] = useState<{ caseId: string; contractId: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await gql<QueryResult>(GET_CASES_AND_CONTRACTS);
        setCases(data.cases);

        // auto-pick first available contract
        const firstCase = data.cases.find((c) => c.contracts.length > 0);
        const firstContract = firstCase?.contracts[0];
        if (firstCase && firstContract) {
          setSelected({ caseId: firstCase.id, contractId: firstContract.id });
          setContractAndInitClauses(firstContract, clauseCount);
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function findContract(caseId: string, contractId: string): Contract | null {
    const c = cases.find((x) => x.id === caseId);
    return c?.contracts.find((k) => k.id === contractId) ?? null;
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
            if (selected) {
              const ct = findContract(selected.caseId, selected.contractId);
              if (ct) setContractAndInitClauses(ct, n);
            }
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
          style={{ marginLeft: 8, minWidth: 320 }}
          value={selected ? `${selected.caseId}::${selected.contractId}` : ""}
          onChange={(e) => {
            const [caseId, contractId] = e.target.value.split("::");
            setSelected({ caseId, contractId });
            const ct = findContract(caseId, contractId);
            if (ct) setContractAndInitClauses(ct, clauseCount);
          }}
        >
          {cases.flatMap((cs) =>
            cs.contracts.map((ct) => (
              <option key={ct.id} value={`${cs.id}::${ct.id}`}>
                {cs.client_name} — {ct.external_ref} ({ct.status}, source {ct.source_system})
              </option>
            ))
          )}
        </select>
      </label>

      <span style={{ color: "#666" }}>
        Problem version: typing rerenders the whole tree → input lag.
      </span>
    </div>
  );
}
