import { pool } from "../db";
import { createLoaders } from "./loaders";

type Ctx = { loaders: ReturnType<typeof createLoaders> };

export const resolvers = {
  Query: {
    cases: async () => {
      console.time("⏱ Query.cases (solution)");
      const r = await pool.query("SELECT * FROM cases ORDER BY created_at DESC");
      console.timeEnd("⏱ Query.cases (solution)");
      return r.rows;
    },
    case: async (_: any, args: { id: string }) => {
      const r = await pool.query("SELECT * FROM cases WHERE id = $1", [args.id]);
      return r.rows[0] ?? null;
    },
  },

  Case: {
    // ✅ Batched: ONE query for all cases in a request, not per case
    contracts: (parent: { id: string }, _: any, ctx: Ctx) => {
      console.time(`⏱ batched contract load for case ${parent.id}`);
      const result = ctx.loaders.contractsByCaseId.load(parent.id);
      console.timeEnd(`⏱ batched contract load for case ${parent.id}`);
      return result;
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
    },
  },
};
