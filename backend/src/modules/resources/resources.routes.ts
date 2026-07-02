import { Router } from "express";
import { getResources } from "./resources.controller.js";

const router = Router();

router.get("/", getResources);

export default router;