import { pool } from "../db";

export async function listCases() {
  const r = await pool.query("SELECT * FROM cases ORDER BY created_at DESC");
  return r.rows;
}

export async function createCase(input: { id: string; clientName: string; status?: string }) {
  const r = await pool.query(
    "INSERT INTO cases (id, client_name, status) VALUES ($1, $2, $3) RETURNING *",
    [input.id, input.clientName, input.status ?? "active"]
  );
  return r.rows[0];
}
