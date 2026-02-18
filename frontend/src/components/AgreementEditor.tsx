import { useAgreement } from "../context/AgreementContext";
import { ClauseRow } from "./ClauseRow";

export function AgreementEditor() {
  const { contract, clauses } = useAgreement();

  if (!contract) return <div style={{ marginTop: 12 }}>Pick an agreement to start.</div>;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: "#666", marginBottom: 6 }}>
        Editing: <b>{contract.external_ref}</b> — rendering {clauses.length} clauses
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        {clauses.map((c) => (
          <ClauseRow key={c.id} clause={c} />
        ))}
      </div>
    </div>
  );
}
