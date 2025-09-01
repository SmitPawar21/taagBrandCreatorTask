# 🎯 Taag.one task – Billing & Creator Matching Platform

## 📌 Overview
This is a full-stack platform designed to streamline the process of managing creators and brand billing.  
It allows brands to select creators, proceed to billing, and manage payouts efficiently with a **step-by-step guided workflow**.  

The platform is built with a focus on:
- **Smooth navigation flow** (Brand Billing → Creator Payout → Summary)  
- **Accurate creator-brand matching model** for selecting relevant creators  
- **Structured billing workflow** with brand and payment details  
- **Modern UI/UX** with dynamic steps, clean form inputs, and real-time state management  

---

## ✨ Features
- 📌 **Creator Matching Model** – allows brands to select creators based on scoring & filters  
- 📌 **Stepwise Billing Workflow** – structured in **3 steps**:  
  1. Brand Billing  
  2. Creator Payout  
  3. Summary  
- 📌 **Payment Method Selection** – UPI, Card, Net Banking, PayPal support  
- 📌 **Dynamic State Handling** – creator selections, form inputs, and billing details are managed efficiently  
- 📌 **Navigation with State** – selected creators are passed to the billing page for seamless processing  

---

## Brand–Creator Matching Logic

The core of this project is a **matching engine** that pairs brands with the most suitable creators.  
The matching is based on a **100-point scoring system** across four dimensions:

**Total Score = Relevance (40) + Audience Fit (30) + Performance/Price (20) + Constraints (10) = 100**

---

### 1. Relevance (40 points)
- **Category Match (20 pts):** Brand’s category compared with creator’s past categories & verticals.  
- **Tone Match (10 pts):** Brand’s tone vs. creator’s content tone.  
- **Platform Match (10 pts):** Brand’s preferred platforms vs. creator’s active platforms.  

**Scoring Method:**  
- Category: `(matches / totalCategories) * 20`  
- Tone: `(matches / totalTones) * 10`  
- Platform: `(matches / totalPlatforms) * 10`

---

### 2. Audience Fit (30 points)
- **Target Location (15 pts):** Brand’s target locations compared with creator’s `audienceGeo`.  
  - For each city matched, add its audience % contribution and then scale to 15.  
- **Target Age (15 pts):** Brand’s target ages vs. creator’s `audienceAge`.  
  - The closer the overlap, the higher the score (scaled to 15).  

---

### 3. Performance & Price (20 points)
- **Engagement Rate (5 pts):**  
  - `0–0.5% → 1`, `0.5–1% → 2`, `1–2% → 3`, `2–3% → 4`, `>3% → 5`  
- **Average Views (5 pts):**  
  - `0–1k → 1`, `1k–5k → 1.5`, `5k–10k → 2`, `10k–50k → 2.5`, `50k–100k → 3`, `100k–250k → 4`, `>250k → 5`  
- **Budget Match (10 pts):**  
  - If creator’s `basePrice` ≤ brand’s budget → score based on affordability.  
  - Example: Closer the price to budget (without exceeding), higher the score.  

---

### 4. Constraints (10 points)
- Example: If brand prohibits adult content and creator produces adult content → 0 pts.  
- If both align on content safety → full 10 pts.  

---

### Flow
1. Take brand details from `req.body`.  
2. Fetch all creators from DB.  
3. Compute a score (0–100) for each creator.  
4. Sort creators by score and return the ranked list.

4. **Billing & Payout Workflow**  
   - The `BillingPage` uses a **stepper** UI:  
     - **Step 1:** Brand Billing (company, GST, budget, payment method, etc.)  
     - **Step 2:** Creator Payout (prefilled creator details + payout information)  
     - **Step 3:** Summary (final review of billing + payout before confirmation)  

This approach ensures a **smooth brand → creator → billing → payout journey** without data loss or confusion.  

---

## 📂 Project Flow
```mermaid
flowchart LR
    A[Match Console] -->|Select Creators| B[Proceed to Billing]
    B --> C[Step 1: Brand Billing]
    C --> D[Step 2: Creator Payout]
    D --> E[Step 3: Summary & Confirmation]
