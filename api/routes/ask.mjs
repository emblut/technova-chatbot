import { Router } from "express";
const router = Router();

import { askQuestion } from "../controllers/askQuestion.mjs";

router.post("/", askQuestion);

export default router;
