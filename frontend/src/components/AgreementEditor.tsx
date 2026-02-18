import { useSelector } from "react-redux";
import { selectClauseIds, selectActiveContract } from "../store/selectors";
import { ClauseRow } from "./ClauseRow";

export function AgreementEditor() {
  const contract = useSelector(selectActiveContract);
  const ids = useSelector(selectClauseIds);

  if (!contract) return <div style={{ marginTop: 12 }}>Pick an agreement to start.</div>;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: "#666", marginBottom: 6 }}>
        Editing: <b>{contract.external_ref}</b> — rendering {ids.length} clauses
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        {ids.map((id) => (
          <ClauseRow key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
