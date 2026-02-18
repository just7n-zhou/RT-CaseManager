// frontend/src/components/AgreementEditor.tsx
import { useAgreement } from "../context/AgreementContext";
import { ClauseRow } from "./ClauseRow";

export function AgreementEditor() {
  const { agreement, clauses } = useAgreement();

  if (!agreement) return <div style={{ marginTop: 12 }}>Pick an agreement to start.</div>;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: "#666", marginBottom: 6 }}>
        Editing: <b>{agreement.ref}</b> — source {agreement.source} — rendering {clauses.length} clauses
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        {clauses.map((c) => (
          <ClauseRow key={c.id} clause={c} />
        ))}
      </div>
    </div>
  );
}
