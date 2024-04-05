import express from "express";
import { getSearchResults } from "../controllers/search.controller";
const router = express.Router();

router.get("/", getSearchResults);

export default router;
