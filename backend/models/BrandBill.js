import mongoose from "mongoose";

const brandBillSchema = new mongoose.Schema({
    company: String,
    GSTIN: String,
    address: String,
    email: String,
    phone: String,
    budget: String,
    paymentMethod: String,
});

export default mongoose.model('BrandBill', brandBillSchema);