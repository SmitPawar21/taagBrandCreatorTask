import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';

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

    console.log("creator name: ", creatorPayouts[0]?.name);

    const [errors, setErrors] = useState({});

    // Validation functions
    const validateGSTIN = (gstin) => {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex.test(gstin);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const validateUPI = (upi) => {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        return upiRegex.test(upi);
    };

    const validateIFSC = (ifsc) => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const handleBrandChange = (e) => {
        const { name, value } = e.target;
        setBrandBilling({ ...brandBilling, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleCreatorChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...creatorPayouts];
        updated[index][name] = value;
        setCreatorPayouts(updated);
        
        // Clear error when user starts typing
        const errorKey = `creator_${index}_${name}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: '' });
        }
    };

    const validateBrandForm = () => {
        const newErrors = {};
        
        // Required field validation
        if (!brandBilling.company.trim()) {
            newErrors.company = 'Company name is required';
        }
        
        if (!brandBilling.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(brandBilling.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!brandBilling.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(brandBilling.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
        }
        
        if (!brandBilling.budget.trim()) {
            newErrors.budget = 'Budget is required';
        } else if (isNaN(brandBilling.budget) || parseFloat(brandBilling.budget) <= 0) {
            newErrors.budget = 'Please enter a valid budget amount';
        }
        
        if (!brandBilling.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        if (!brandBilling.paymentMethod) {
            newErrors.paymentMethod = 'Please select a payment method';
        }
        
        // Optional GSTIN validation - only validate if provided
        if (brandBilling.GSTIN.trim() && !validateGSTIN(brandBilling.GSTIN)) {
            newErrors.GSTIN = 'Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateCreatorForm = () => {
        const newErrors = {};
        
        creatorPayouts.forEach((creator, index) => {
            const prefix = `creator_${index}_`;
            
            // Required validations
            if (!creator.PAN.trim()) {
                newErrors[`${prefix}PAN`] = 'PAN is required';
            } else if (!validatePAN(creator.PAN)) {
                newErrors[`${prefix}PAN`] = 'Please enter a valid PAN (e.g., ABCDE1234F)';
            }
            
            if (!creator.UPI.trim()) {
                newErrors[`${prefix}UPI`] = 'UPI ID is required';
            } else if (!validateUPI(creator.UPI)) {
                newErrors[`${prefix}UPI`] = 'Please enter a valid UPI ID (e.g., user@paytm)';
            }
            
            if (!creator.bank.trim()) {
                newErrors[`${prefix}bank`] = 'Bank account number is required';
            }
            
            if (!creator.IFSC.trim()) {
                newErrors[`${prefix}IFSC`] = 'IFSC code is required';
            } else if (!validateIFSC(creator.IFSC)) {
                newErrors[`${prefix}IFSC`] = 'Please enter a valid IFSC code (e.g., SBIN0001234)';
            }
            
            if (!creator.address.trim()) {
                newErrors[`${prefix}address`] = 'Address is required';
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!validateBrandForm()) {
                return; // Stop if validation fails
            }
            await handleBrandBill();
        } else if (step === 2) {
            if (!validateCreatorForm()) {
                return; // Stop if validation fails
            }
            await handleCreatorBill();
        }
        setStep(step + 1);
    };
    const handlePrev = () => setStep(step - 1);

    const handleBrandBill = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billing/brand`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(brandBilling),
            });
            const data = await res.json();
        } catch (err) {
            console.error("Brand billing error:", err);
        }
    };

    const handleCreatorBill = async () => {
        try {
            const amount = creatorPayouts.reduce((sum, c) => sum + Number(c.basePrice || 0), 0);

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

    const generatePDFInvoice = () => {
        const doc = new jsPDF();
        
        // Set colors
        const primaryColor = [197, 243, 125]; // #C5F37D
        const darkColor = [1, 64, 47]; // #01402F
        const textColor = [0, 0, 0]; // Black
        
        // Header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text('INVOICE', 105, 20, { align: 'center' });
        
        // Invoice details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        
        const currentDate = new Date().toLocaleDateString();
        const invoiceNumber = `INV-${Date.now()}`;
        
        doc.text(`Invoice #: ${invoiceNumber}`, 20, 40);
        doc.text(`Date: ${currentDate}`, 20, 45);
        
        // Brand Billing Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Brand Billing Details', 20, 60);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        let yPos = 70;
        
        const brandDetails = [
            ['Company:', brandBilling.company],
            ['GSTIN:', brandBilling.GSTIN],
            ['Email:', brandBilling.email],
            ['Phone:', brandBilling.phone],
            ['Address:', brandBilling.address],
            ['Payment Method:', brandBilling.paymentMethod]
        ];
        
        brandDetails.forEach(([label, value]) => {
            if (value) {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 20, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(value.toString(), 60, yPos);
                yPos += 7;
            }
        });
        
        // Financial Summary
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Financial Summary', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Create a table-like structure for financial details
        doc.text('Budget:', 20, yPos);
        doc.text(`₹${parseFloat(brandBilling.budget || 0).toLocaleString('en-IN')}`, 160, yPos, { align: 'right' });
        yPos += 7;
        
        doc.text('GST (18%):', 20, yPos);
        doc.text(`₹${gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 160, yPos, { align: 'right' });
        yPos += 7;
        
        // Total with highlighting
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(15, yPos - 3, 170, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Total Amount:', 20, yPos + 3);
        doc.text(`₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 160, yPos + 3, { align: 'right' });
        
        yPos += 20;
        
        // Creator Payouts Section
        if (creatorPayouts.length > 0) {
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Creator Payout Details', 20, yPos);
            
            yPos += 10;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            
            creatorPayouts.forEach((creator, index) => {
                // Check if we need a new page
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.text(`Creator ${index + 1}: ${creator.name}`, 20, yPos);
                yPos += 7;
                
                doc.setFont('helvetica', 'normal');
                const creatorDetails = [
                    ['PAN:', creator.PAN],
                    ['UPI:', creator.UPI],
                    ['Bank:', creator.bank],
                    ['IFSC:', creator.IFSC],
                    ['Address:', creator.address]
                ];
                
                creatorDetails.forEach(([label, value]) => {
                    if (value) {
                        doc.text(`  ${label}`, 25, yPos);
                        doc.text(value.toString(), 65, yPos);
                        yPos += 5;
                    }
                });
                
                yPos += 5; // Space between creators
            });
        }
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
        doc.text('This is a computer-generated invoice.', 105, pageHeight - 15, { align: 'center' });
        
        // Save the PDF
        const fileName = `Invoice_${brandBilling.company || 'Brand'}_${currentDate.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
    };

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
                                        className={`w-full bg-[#01402F] border ${errors[field] ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]`}
                                    />
                                    {errors[field] && (
                                        <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
                                    )}
                                </div>
                            ))}

                            <div>
                                <select
                                    name="paymentMethod"
                                    value={brandBilling.paymentMethod}
                                    onChange={handleBrandChange}
                                    className={`w-full bg-[#01402F] border ${errors.paymentMethod ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]`}
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="netbanking">Net Banking</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                                {errors.paymentMethod && (
                                    <p className="text-red-400 text-xs mt-1">{errors.paymentMethod}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <textarea
                                    name="address"
                                    placeholder="Address"
                                    value={brandBilling.address}
                                    onChange={handleBrandChange}
                                    rows="3"
                                    className={`w-full bg-[#01402F] border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]`}
                                />
                                {errors.address && (
                                    <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                                )}
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
                                                    className={`w-full bg-[#01402F] border ${errors[`creator_${index}_${field}`] ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]`}
                                                />
                                                {errors[`creator_${index}_${field}`] && (
                                                    <p className="text-red-400 text-xs mt-1">{errors[`creator_${index}_${field}`]}</p>
                                                )}
                                            </div>
                                        ))}
                                        <div className="md:col-span-2">
                                            <textarea
                                                name="address"
                                                placeholder="Address"
                                                value={payout.address}
                                                onChange={(e) => handleCreatorChange(index, e)}
                                                rows="2"
                                                className={`w-full bg-[#01402F] border ${errors[`creator_${index}_address`] ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C5F37D] focus:ring-1 focus:ring-[#C5F37D]`}
                                            />
                                            {errors[`creator_${index}_address`] && (
                                                <p className="text-red-400 text-xs mt-1">{errors[`creator_${index}_address`]}</p>
                                            )}
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
                                onClick={generatePDFInvoice}
                                className="bg-[#C5F37D] text-black font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Save / Print PDF
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