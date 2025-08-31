import express from "express";
import { getAllBrands, matchBrandWithCreators, postBrandBrief } from "../controller/brandController.js";

const router = express.Router();

router.get("/all-brands", getAllBrands);
router.post("/brand-brief", postBrandBrief);

router.post("/match", matchBrandWithCreators);

export default router;