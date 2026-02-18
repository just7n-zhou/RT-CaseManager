import { useAgreement } from "../context/AgreementContext";
import type { Clause } from "../types";

function expensiveWork(n: number) {
  let x = 0;
  for (let i = 0; i < 5000; i++) x += (i * n) % 97;
  return x;
}

export function ClauseRow({ clause }: { clause: Clause }) {
  const { updateClause } = useAgreement();

  // Simulate deep drafting logic work per render
  expensiveWork(Number(clause.id));

  return (
    <div style={{ display: "flex", gap: 8, padding: "6px 0" }}>
      <div style={{ width: 90, color: "#666" }}>Clause {clause.id}</div>
      <input
        style={{ flex: 1 }}
        value={clause.text}
        onChange={(e) => updateClause(clause.id, e.target.value)}
      />
    </div>
  );
}
