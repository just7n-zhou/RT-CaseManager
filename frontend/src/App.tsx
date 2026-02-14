import { useEffect, useState } from "react";

type CaseRow = {
  id: string;
  client_name: string;
  status: string;
  created_at: string;
};

export default function App() {
  const [health, setHealth] = useState<string>("checking...");
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [clientName, setClientName] = useState("");

  async function load() {
    const h = await fetch("/health").then((r) => r.json());
    setHealth(h.ok ? "ok" : "down");

    const list = await fetch("/api/cases").then((r) => r.json());
    setCases(list);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCase(e: React.FormEvent) {
    e.preventDefault();
    const name = clientName.trim();
    if (!name) return;

    await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: name }),
    });

    setClientName("");
    await load();
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>Case Manager (Local Mock)</h2>

      <div style={{ marginBottom: 12 }}>
        Backend health: <b>{health}</b>
      </div>

      <form onSubmit={addCase} style={{ display: "flex", gap: 8 }}>
        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Client name"
        />
        <button type="submit">Add Case</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Cases</h3>
      <ul>
        {cases.map((c) => (
          <li key={c.id}>
            {c.client_name} — {c.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
