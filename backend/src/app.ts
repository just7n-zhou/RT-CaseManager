import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  const r = await pool.query("select 1 as ok");
  res.json({ ok: true, db: r.rows[0].ok });
});

/* ------------------------------
   CASE ROUTES
--------------------------------*/

// List all cases
app.get("/api/cases", async (_req, res) => {
  const result = await pool.query(
    "SELECT * FROM cases ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// Create a case
app.post("/api/cases", async (req, res) => {
  const { clientName, status } = req.body;

  if (!clientName) {
    return res.status(400).json({ error: "clientName is required" });
  }

  const id = crypto.randomUUID?.() ?? String(Date.now());

  const result = await pool.query(
    "INSERT INTO cases (id, client_name, status) VALUES ($1, $2, $3) RETURNING *",
    [id, clientName, status ?? "active"]
  );

  res.status(201).json(result.rows[0]);
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
