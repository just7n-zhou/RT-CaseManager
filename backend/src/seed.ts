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
}
