import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./connection.js";
import brandRouter from "./router/brandRouter.js";
import creatorRouter from "./router/creatorRouter.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/brand", brandRouter);
app.use("/creator", creatorRouter);

app.get("/", (req, res) => {
    res.status(201).json({message: "Hello Smit"});
})

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})