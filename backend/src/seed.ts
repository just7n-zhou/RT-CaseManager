// backend/src/seed.ts
import { pool } from "./db";

export async function seed() {
  // -----------------------------
  // 1) Seed base cases (idempotent)
  // -----------------------------
  const cases = [
    { id: "case_001", client_name: "Acme Corp", status: "active" },
    { id: "case_002", client_name: "Northwind Legal", status: "active" },
    { id: "case_003", client_name: "Contoso", status: "closed" },
  ];

  for (const c of cases) {
    await pool.query(
      `INSERT INTO cases (id, client_name, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.client_name, c.status]
    );
  }

  // ---------------------------------------------
  // 2) Seed two "raw sources" with inconsistent fields
  // ---------------------------------------------
  const sourceA = [
    {
      id: "a_001",
      case_id: "case_001",
      agreement_id: "AG-1001",
      status_text: "ACTIVE",
      renewal_dt: "2026-12-31",
    },
    {
      id: "a_002",
      case_id: "case_002",
      agreement_id: "AG-2001",
      status_text: "ACTIVE",
      renewal_dt: "2026-10-15",
    },
  ];

  const sourceB = [
    {
      id: "b_001",
      case_id: "case_001",
      contract_ref: "CR-9009",
      state: "active",
      renewal_date: "2026-11-30",
    },
    {
      id: "b_002",
      case_id: "case_003",
      contract_ref: "CR-3003",
      state: "closed",
      renewal_date: null,
    },
  ];

  for (const row of sourceA) {
    await pool.query(
      `INSERT INTO source_a_contracts (id, case_id, agreement_id, status_text, renewal_dt)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [row.id, row.case_id, row.agreement_id, row.status_text, row.renewal_dt]
    );
  }

  for (const row of sourceB) {
    await pool.query(
      `INSERT INTO source_b_contracts (id, case_id, contract_ref, state, renewal_date)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [row.id, row.case_id, row.contract_ref, row.state, row.renewal_date]
    );
  }

  // ---------------------------------------------------------
  // 3) Normalize sources into ONE stable contracts table
  //    - external_ref = AgreementID / ContractRef
  //    - status normalized to active/closed
  // ---------------------------------------------------------

  // Source A -> contracts
  await pool.query(`
    INSERT INTO contracts (id, case_id, external_ref, source_system, status, renewal_date)
    SELECT
      'contract_a_' || id,
      case_id,
      agreement_id,
      'A',
      CASE WHEN lower(status_text) = 'active' THEN 'active' ELSE 'closed' END,
      renewal_dt
    FROM source_a_contracts
    ON CONFLICT (id) DO NOTHING
  `);

  // Source B -> contracts
  await pool.query(`
    INSERT INTO contracts (id, case_id, external_ref, source_system, status, renewal_date)
    SELECT
      'contract_b_' || id,
      case_id,
      contract_ref,
      'B',
      CASE WHEN lower(state) = 'active' THEN 'active' ELSE 'closed' END,
      renewal_date
    FROM source_b_contracts
    ON CONFLICT (id) DO NOTHING
  `);

  // ---------------------------------------------------------
  // 4) Seed a small version timeline per contract (idempotent)
  // ---------------------------------------------------------
  const contracts = await pool.query<{ id: string }>(`SELECT id FROM contracts`);

  for (const c of contracts.rows) {
    // version 1 (draft)
    await pool.query(
      `INSERT INTO contract_versions (id, contract_id, version_number, status)
       VALUES ($1, $2, 1, 'draft')
       ON CONFLICT (id) DO NOTHING`,
      [`v1_${c.id}`, c.id]
    );

    // version 2 (approved)
    await pool.query(
      `INSERT INTO contract_versions (id, contract_id, version_number, status)
       VALUES ($1, $2, 2, 'approved')
       ON CONFLICT (id) DO NOTHING`,
      [`v2_${c.id}`, c.id]
    );
  }
}
