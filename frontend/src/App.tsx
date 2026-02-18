// frontend/src/App.tsx
import { useEffect, useState } from "react";

type Version = {
  id: string;
  version_number: number;
  status: string;
  created_at: string;
};

type VersionsPage = {
  items: Version[];
  nextCursor: string | null;
};

type Contract = {
  id: string;
  external_ref: string;
  status: string;
  renewal_date?: string | null;
  source_system: string;
  versions: VersionsPage;
};

type CaseRow = {
  id: string;
  client_name: string;
  status: string;
  contracts: Contract[];
};

const QUERY = `
  query {
    cases {
      id
      client_name
      status
      contracts {
        id
        external_ref
        status
        renewal_date
        source_system
        versions(limit: 5) {
          items { id version_number status created_at }
          nextCursor
        }
      }
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
      <h2>GraphQL Solution Branch Demo</h2>
      <p style={{ marginTop: 0 }}>
        Stable schema: <b>Case → Contract → Version timeline</b>
      </p>

      <button onClick={load} disabled={loading}>
        {loading ? "Loading..." : "Reload"}
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
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
              <b>{c.client_name}</b> — {c.status}{" "}
              <span style={{ color: "#666" }}>({c.id})</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>Contracts</div>
              {c.contracts.length === 0 ? (
                <div style={{ color: "#666" }}>No contracts</div>
              ) : (
                c.contracts.map((ct) => (
                  <div
                    key={ct.id}
                    style={{
                      marginTop: 8,
                      padding: 10,
                      border: "1px solid #eee",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      Ref: <b>{ct.external_ref}</b> — {ct.status} — Source{" "}
                      {ct.source_system}
                      {ct.renewal_date ? ` — Renewal: ${ct.renewal_date}` : ""}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 600 }}>Version timeline</div>
                      {ct.versions.items.length === 0 ? (
                        <div style={{ color: "#666" }}>No versions</div>
                      ) : (
                        <ul style={{ margin: "6px 0 0 18px" }}>
                          {ct.versions.items.map((v) => (
                            <li key={v.id}>
                              v{v.version_number}: {v.status}{" "}
                              <span style={{ color: "#666" }}>
                                ({new Date(v.created_at).toLocaleString()})
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {ct.versions.nextCursor && (
                        <div style={{ marginTop: 6, color: "#666" }}>
                          nextCursor: {ct.versions.nextCursor}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
