import BrandBill from "../models/BrandBill.js";

export const postBrandBill = async (req, res) => {
    const brandBill = req.body;

    if (!brandBill) {
        res.status(400).json({ message: "Brand Bill is empty" });
    }

    try {
        const newBrandBill = new BrandBill();
        newBrandBill.company = brandBill.company;
        newBrandBill.GSTIN = brandBill.GSTIN;
        newBrandBill.address = brandBill.address;
        newBrandBill.email = brandBill.email;
        newBrandBill.phone = brandBill.phone;
        newBrandBill.budget = brandBill.budget;
        newBrandBill.paymentMethod = brandBill.paymentMethod;

        const savedBrandBill = await newBrandBill.save();

        res.status(201).json({ message: "success", brandBill: savedBrandBill })
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export const postCreatorBill = async (req, res) => {
    const { amount } = req.body;

    const gstRate = 0.18;
    const gstAmount = amount * gstRate;
    const totalAmount = amount + gstAmount;

    const summary = {
        baseAmount: amount,
        gstRate: `${gstRate * 100}%`,
        gstAmount,
        totalAmount,
    };

    return res.json({
        message: "Creator billing summary generated successfully.",
        summary,
    });

}