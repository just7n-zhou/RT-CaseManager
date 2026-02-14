import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db";
import { seed } from "./seed";
import { casesRouter } from "./routes/cases.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  const r = await pool.query("select 1 as ok");
  res.json({ ok: true, db: r.rows[0].ok });
});

app.use("/api/cases", casesRouter);

const port = Number(process.env.PORT);

async function start() {
  // ensure DB reachable first
  await pool.query("select 1");
  await seed(); // seed initial data
  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
