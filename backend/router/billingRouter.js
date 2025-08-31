import express from "express";

const router = express.Router();

router.post("/brand", postBrandBill);

export default router;