import { pool } from "../db";
import { createLoaders } from "./loaders";

type Ctx = { loaders: ReturnType<typeof createLoaders> };

// unique suffix to avoid console.time label collisions across parallel resolvers/requests
let timerSeq = 0;
function timeLabel(base: string) {
  timerSeq = (timerSeq + 1) % 1_000_000;
  return `${base} #${timerSeq}`;
}

export const resolvers = {
  Query: {
    cases: async () => {
      const label = timeLabel("⏱ Query.cases (solution)");
      console.time(label);
      try {
        const r = await pool.query("SELECT * FROM cases ORDER BY created_at DESC");
        return r.rows;
      } finally {
        console.timeEnd(label);
      }
    },

    case: async (_: any, args: { id: string }) => {
      const r = await pool.query("SELECT * FROM cases WHERE id = $1", [args.id]);
      return r.rows[0] ?? null;
    },
  },

  Case: {
    // ✅ Batched via DataLoader; we time the *awaited* result
    contracts: async (parent: { id: string }, _: any, ctx: Ctx) => {
      const label = timeLabel(`⏱ Case.contracts load (solution) case=${parent.id}`);
      console.time(label);
      try {
        return await ctx.loaders.contractsByCaseId.load(parent.id);
      } finally {
        console.timeEnd(label);
      }
    },
  },

  Contract: {
    // ✅ Keyset pagination on created_at for timeline
    versions: async (
      parent: { id: string },
      args: { limit?: number; cursor?: string | null }
    ) => {
      const limit = Math.min(args.limit ?? 20, 50);
      const cursor = args.cursor ?? null;

      const label = timeLabel(`⏱ Contract.versions (solution) contract=${parent.id} limit=${limit}`);
      console.time(label);

      try {
        const values: any[] = [parent.id, limit];
        let cursorSql = "";

        if (cursor) {
          values.push(cursor);
          cursorSql = `AND created_at < $3::timestamptz`;
        }

        const r = await pool.query(
          `
          SELECT * FROM contract_versions
          WHERE contract_id = $1
          ${cursorSql}
          ORDER BY created_at DESC
          LIMIT $2
          `,
          values
        );

        const items = r.rows;
        const nextCursor = items.length ? items[items.length - 1].created_at : null;

        return { items, nextCursor };
      } finally {
        console.timeEnd(label);
      }
    },
  },
};
