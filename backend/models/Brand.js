import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
        _id: String,                        // "b1" 
        name: String,                       // "Acme Activewear"
        category: String,                   // "Fashion"
        budgetINR: Number,                  // 500000 
        targetLocations: [String],          // ["Mumbai","Delhi"]
        targetAges: [Number],               // [18,30]
        goals: [String],                    // ["installs","awareness"]
        tone: [String],                     // ["energetic","clean"]
        platforms: [String],                // ["Instagram","YouTube"]
        constraints: {                      
            noAdultContent: Boolean,        // true
            timelineDays: Number            // 21
        }
});

export default mongoose.model('Brand', brandSchema);