import { pool } from "./db";

export async function seed() {
  // Keep IDs stable so inserts can be idempotent
  const samples = [
    { id: "case_001", client_name: "Acme Corp", status: "active" },
    { id: "case_002", client_name: "Northwind Legal", status: "active" },
    { id: "case_003", client_name: "Contoso", status: "closed" },
  ];

  for (const c of samples) {
    await pool.query(
      `INSERT INTO cases (id, client_name, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.client_name, c.status]
    );
  }

  const a = [
    { id: "a_001", case_id: "case_001", agreement_id: "AG-1001", status_text: "ACTIVE", renewal_dt: "2026-12-31" },
    { id: "a_002", case_id: "case_002", agreement_id: "AG-2001", status_text: "ACTIVE", renewal_dt: "2026-10-15" },
  ];

  const b = [
    { id: "b_001", case_id: "case_001", contract_ref: "CR-9009", state: "active", renewal_date: "2026-11-30" },
    { id: "b_002", case_id: "case_003", contract_ref: "CR-3003", state: "closed", renewal_date: null },
  ];

  for (const row of a) {
    await pool.query(
      `INSERT INTO source_a_contracts (id, case_id, agreement_id, status_text, renewal_dt)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [row.id, row.case_id, row.agreement_id, row.status_text, row.renewal_dt]
    );
  }

  for (const row of b) {
    await pool.query(
      `INSERT INTO source_b_contracts (id, case_id, contract_ref, state, renewal_date)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [row.id, row.case_id, row.contract_ref, row.state, row.renewal_date]
    );
  }

}
