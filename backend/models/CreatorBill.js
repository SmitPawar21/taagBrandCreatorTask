import mongoose from "mongoose";

const creatorBillSchema = new mongoose.Schema({
    name: String,
    PAN: String,
    UPI: String,
    bank: String,
    IFSC: String,
    address: String,
});

export default mongoose.model('CreatorBill', creatorBillSchema);