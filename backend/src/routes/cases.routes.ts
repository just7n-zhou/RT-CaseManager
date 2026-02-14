import { Router } from "express";
import { getCases, postCase } from "../controllers/cases.controller";

export const casesRouter = Router();

casesRouter.get("/", getCases);
casesRouter.post("/", postCase);
