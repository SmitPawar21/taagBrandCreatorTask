import express from "express";
import { postBrandBill, postCreatorBill } from "../controller/billingController.js";

const router = express.Router();

router.post("/brand", postBrandBill);
router.post("/creator", postCreatorBill);

export default router;