import mongoose from "mongoose";

const creatorScehma = new mongoose.Schema({
    _id: String,                         // "c1" 
    handle: String,                      // "@fitwithria"
    verticals: [String],                 // ["Fitness","Lifestyle"]
    platforms: [String],                 // ["Instagram","YouTube"]
    audienceGeo: {                       // object with city → percentage mapping
        type: Map,
        of: Number
    },

    audienceAge: {                       // object with age-range → percentage mapping
        type: Map,
        of: Number
    },

    avgViews: Number,                    // 120000
    engagementRate: Number,              // 0.047 

    pastBrandCategories: [String],       // ["Fashion","Wellness"]
    contentTone: [String],               // ["energetic","fun"]

    safetyFlags: {                       
        adult: Boolean,                    // false
        controversial: Boolean             // false
    },

    basePriceINR: Number                 // 80000
});

export default mongoose.model('Creator', creatorScehma);