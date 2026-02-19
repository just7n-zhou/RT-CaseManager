import DataLoader from "dataloader";
import { pool } from "../db";

let loaderSeq = 0;
function timeLabel(base: string) {
  loaderSeq = (loaderSeq + 1) % 1_000_000;
  return `${base} #${loaderSeq}`;
}

export function createLoaders() {
  const contractsByCaseId = new DataLoader<string, any[]>(async (caseIds) => {
    const label = timeLabel(`⏱ DataLoader batch contractsByCaseId (size=${caseIds.length})`);
    console.time(label);
    try {
      const r = await pool.query(
        `SELECT * FROM contracts WHERE case_id = ANY($1::text[])`,
        [caseIds]
      );

      const map = new Map<string, any[]>();
      caseIds.forEach((id) => map.set(id, []));
      for (const row of r.rows) map.get(row.case_id)!.push(row);

      return caseIds.map((id) => map.get(id)!);
    } finally {
      console.timeEnd(label);
    }
  });

  return { contractsByCaseId };
}