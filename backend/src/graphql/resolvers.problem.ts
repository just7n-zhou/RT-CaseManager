import { pool } from "../db";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let timerSeq = 0;
function timeLabel(base: string) {
  timerSeq = (timerSeq + 1) % 1_000_000;
  return `${base} #${timerSeq}`;
}

export const resolvers = {
  Query: {
    cases: async () => {
      const label = timeLabel("⏱ Query.cases (problem)");
      console.time(label);

      const r = await pool.query("SELECT * FROM cases ORDER BY created_at DESC");

      console.timeEnd(label);
      return r.rows;
    },
    case: async (_: any, args: { id: string }) => {
      const r = await pool.query("SELECT * FROM cases WHERE id = $1", [args.id]);
      return r.rows[0] ?? null;
    },
  },

  Case: {
    // Problem: N+1 — for every Case row, we query each source separately
    sourceAContracts: async (parent: { id: string }) => {
      const label = timeLabel(`⏱ Case.sourceAContracts case=${parent.id}`);
      console.time(label);

      try {
        await sleep(80); // simulate slow upstream / messy data fetch
        const r = await pool.query(
          "SELECT id, case_id, agreement_id, status_text, renewal_dt FROM source_a_contracts WHERE case_id = $1",
          [parent.id]
        );

        return r.rows.map((x: any) => ({
          id: x.id,
          case_id: x.case_id,
          AgreementID: x.agreement_id,
          StatusText: x.status_text,
          RenewalDT: x.renewal_dt,
        }));
      } finally {
        console.timeEnd(label);
      }
    },

    sourceBContracts: async (parent: { id: string }) => {
      // ✅ correct label (B, not A) + unique suffix
      const label = timeLabel(`⏱ Case.sourceBContracts case=${parent.id}`);
      console.time(label);

      try {
        await sleep(80);
        const r = await pool.query(
          "SELECT id, case_id, contract_ref, state, renewal_date FROM source_b_contracts WHERE case_id = $1",
          [parent.id]
        );

        return r.rows.map((x: any) => ({
          id: x.id,
          case_id: x.case_id,
          ContractRef: x.contract_ref,
          State: x.state,
          RenewalDate: x.renewal_date,
        }));
      } finally {
        console.timeEnd(label);
      }
    },
  },
};
