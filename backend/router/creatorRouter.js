import express from "express";
import { getAllCreators, postOneCreator } from "../controller/creatorController.js";

const router = express.Router();

router.get("/all-creators", getAllCreators);

router.post("/add-creator", postOneCreator);

export default router;