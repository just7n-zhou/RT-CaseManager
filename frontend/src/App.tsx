// frontend/src/App.tsx
import { useEffect, useState } from "react";

type SourceAContract = {
  id: string;
  AgreementID: string;
  StatusText: string;
  RenewalDT?: string | null;
};

type SourceBContract = {
  id: string;
  ContractRef: string;
  State: string;
  RenewalDate?: string | null;
};

type CaseRow = {
  id: string;
  client_name: string;
  status: string;
  sourceAContracts: SourceAContract[];
  sourceBContracts: SourceBContract[];
};

const QUERY = `
  query {
    cases {
      id
      client_name
      status
      sourceAContracts { id AgreementID StatusText RenewalDT }
      sourceBContracts { id ContractRef State RenewalDate }
    }
  }
`;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [cases, setCases] = useState<CaseRow[]>([]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: QUERY }),
      });

      const json = await res.json();

      if (!res.ok || json.errors) {
        throw new Error(json.errors?.[0]?.message ?? "GraphQL request failed");
      }

      setCases(json.data.cases);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>GraphQL Problem Branch Demo</h2>
      <p style={{ marginTop: 0 }}>
        This intentionally shows inconsistent fields from different sources.
      </p>

      <button onClick={load} disabled={loading}>
        {loading ? "Loading..." : "Reload"}
      </button>

      {error && (
        <p style={{ color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && cases.length === 0 && <p>No cases found.</p>}

      <div style={{ marginTop: 12 }}>
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <b>{c.client_name}</b> — {c.status} <span style={{ color: "#666" }}>({c.id})</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>Source A (AgreementID / StatusText)</div>
              {c.sourceAContracts.length === 0 ? (
                <div style={{ color: "#666" }}>No Source A contracts</div>
              ) : (
                <ul>
                  {c.sourceAContracts.map((x) => (
                    <li key={x.id}>
                      AgreementID: <b>{x.AgreementID}</b>, StatusText: {x.StatusText}
                      {x.RenewalDT ? `, RenewalDT: ${x.RenewalDT}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>Source B (ContractRef / State)</div>
              {c.sourceBContracts.length === 0 ? (
                <div style={{ color: "#666" }}>No Source B contracts</div>
              ) : (
                <ul>
                  {c.sourceBContracts.map((x) => (
                    <li key={x.id}>
                      ContractRef: <b>{x.ContractRef}</b>, State: {x.State}
                      {x.RenewalDate ? `, RenewalDate: ${x.RenewalDate}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
