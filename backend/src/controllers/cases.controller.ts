import type { Request, Response } from "express";
import { createCase, listCases } from "../services/cases.service";
import crypto from "node:crypto";

export async function getCases(_req: Request, res: Response) {
  const items = await listCases();
  res.json(items);
}

export async function postCase(req: Request, res: Response) {
  const clientName = String(req.body?.clientName ?? "").trim();
  const status = req.body?.status ? String(req.body.status).trim() : undefined;

  if (!clientName) return res.status(400).json({ error: "clientName is required" });

  const id = crypto.randomUUID();
  const created = await createCase({ id, clientName, status });
  res.status(201).json(created);
}
