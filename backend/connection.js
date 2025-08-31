import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DATABASE CONNECTED");
    } catch (err) {
        console.error("Database connectivity error: ", err);
    }
}