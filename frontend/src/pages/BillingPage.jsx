import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BillingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const selectedCreators = location.state?.selectedCreators || [];
    const brandBrief = location.state?.brandBrief || [];

    const [brandBilling, setBrandBilling] = useState({
        company: brandBrief.name || "",
        GSTIN: "",
        address: "",
        email: "",
        phone: "",
        budget: brandBrief.budgetINR || "",
        paymentMethod: "UPI",
    });

    console.log("BrandBilling: ", brandBilling);

    const [creatorPayouts, setCreatorPayouts] = useState(
        selectedCreators.map((creator) => ({
            name: creator.creator.handle || "",
            PAN: "",
            UPI: "",
            bank: "",
            IFSC: "",
            address: "",
        }))
    );

    console.log("creator name: ", creatorPayouts[0].name);

    const [errors, setErrors] = useState({});

    const handleBrandChange = (e) => {
        setBrandBilling({ ...brandBilling, [e.target.name]: e.target.value });
    };

    const handleCreatorChange = (index, e) => {
        const updated = [...creatorPayouts];
        updated[index][e.target.name] = e.target.value;
        setCreatorPayouts(updated);
    };

    const handleNext = async () => {
        if(step === 1) {
            await handleBrandBill();
        }

        else if(step === 2) {
            await handleCreatorBill();
        }
        setStep(step + 1);
    }
    const handlePrev = () => setStep(step - 1);

    const handleBrandBill = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billing/brand`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(brandForm),
            });
            const data = await res.json();
        } catch (err) {
            console.error("Brand billing error:", err);
        }
    };

    const handleCreatorBill = async () => {
        try {
            const amount = creatorForm.reduce((sum, c) => sum + Number(c.basePrice), 0);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billing/creator`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, description: "Creator payout summary" }),
            });
            const data = await res.json();
        } catch (err) {
            console.error("Creator billing error:", err);
        }
    };

    const calculateGST = () => {
        const budget = parseFloat(brandBilling.budget || 0);
        const gst = budget * 0.18;
        return { gst, total: budget + gst };
    };

    const { gst, total } = calculateGST();

    return (
        <div className="bg-[#000000] text-gray-200 min-h-screen p-4 sm:p-8 flex justify-center items-center">
            <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-[#001719] border border-[#01402F] rounded-2xl">

                <div className="relative flex justify-between mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#01402F] -translate-y-1/2"></div>
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-[#C5F37D] -translate-y-1/2 transition-all duration-500"
                        style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    ></div>
                    {["Brand Billing", "Creator Payout", "Summary"].map((label, i) => (
                        <div key={i} className="z-10 text-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 ${step >= i + 1 ? 'bg-[#C5F37D] text-black' : 'bg-[#01402F] text-gray-400'
                                    }`}
                            >
                                {i + 1}
                            </div>
                            <p className={`text-xs sm:text-sm ${step >= i + 1 ? 'text-[#C5F37D]' : 'text-gray-500'}`}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-white">Brand Billing Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["company", "GSTIN", "email", "phone", "budget"].map((field) => (
                                <div key={field}>
                                    <input
                                        type={
                                            field === "email"
                                                ? "email"
                                                : field === "phone" || field === "budget"
                                                    ? "tel"
                                                    : "text"
                                        }
                                        name={field}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={brandBilling[field]}
                                        onChange={handleBrandChange}
                                        className="w-full bg-[#01402F] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]"
                                    />
                                </div>
                            ))}

                            <div>
                                <select
                                    name="paymentMethod"
                                    value={brandBilling.paymentMethod}
                                    onChange={handleBrandChange}
                                    className="w-full bg-[#01402F] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]"
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="netbanking">Net Banking</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <textarea
                                    name="address"
                                    placeholder="Address"
                                    value={brandBilling.address}
                                    onChange={handleBrandChange}
                                    rows="3"
                                    className="w-full bg-[#01402F] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={handleNext}
                                className="bg-[#C5F37D] text-black font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-1 text-white">Creator Payout Details</h2>
                        <p className="mb-6">* Creator Name is Autofilled by their handle</p>
                        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">
                            {creatorPayouts.map((payout, index) => (
                                <div key={index} className="p-4 border border-[#01402F] rounded-lg bg-[#002427]">
                                    <h3 className="text-lg font-bold text-[#C5F37D] mb-4">
                                        Creator {index + 1}: {payout.name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["PAN", "UPI", "bank", "IFSC"].map((field) => (
                                            <div key={field}>
                                                <input
                                                    type="text"
                                                    name={field}
                                                    placeholder={field.toUpperCase()}
                                                    value={payout[field]}
                                                    onChange={(e) => handleCreatorChange(index, e)}
                                                    className="w-full bg-[#01402F] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]"
                                                />
                                            </div>
                                        ))}
                                        <div className="md:col-span-2">
                                            <textarea
                                                name="address"
                                                placeholder="Address"
                                                value={payout.address}
                                                onChange={(e) => handleCreatorChange(index, e)}
                                                rows="2"
                                                className="w-full bg-[#01402F] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                className="bg-transparent border border-[#057B51] text-[#C5F37D] font-bold px-6 py-3 rounded-lg hover:bg-[#01402F] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-[#C5F37D] text-black font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-white">Summary</h2>
                        <div className="bg-[#01402F] p-6 rounded-lg space-y-6">

                            <div>
                                <h3 className="text-lg font-bold text-[#C5F37D] mb-2">Brand Billing</h3>
                                <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                                    <span>Company:</span> <span>{brandBilling.company}</span>
                                    <span>Budget:</span> <span>₹{brandBilling.budget}</span>
                                    <span>GST (18%):</span> <span>₹{gst.toFixed(2)}</span>
                                    <span className="font-bold">Total:</span> <span className="font-bold">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <hr className="border-gray-700" />

                            <div>
                                <h3 className="text-lg font-bold text-[#C5F37D] mb-2">Creator Payouts</h3>
                                {creatorPayouts.map((payout, i) => (
                                    <div key={i} className="mb-4">
                                        <p className="font-semibold">{payout.name}</p>
                                        <p>PAN: {payout.PAN}</p>
                                        <p>UPI: {payout.UPI}</p>
                                        <p>Bank: {payout.bank}</p>
                                        <p>IFSC: {payout.IFSC}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                className="bg-transparent border border-[#057B51] text-[#C5F37D] font-bold px-6 py-3 rounded-lg hover:bg-[#01402F] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => alert("Summary saved/printed")}
                                className="bg-[#C5F37D] text-black font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Save / Print
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="bg-[#C5F37D] text-black font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingPage;
