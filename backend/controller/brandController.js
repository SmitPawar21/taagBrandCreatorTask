import Brand from "../models/Brand.js";
import Creator from "../models/Creator.js";

export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();

        res.status(201).json({message: "success", brands: brands});
    } catch (err) {
        res.status(500).json({error: err});
    }
}

export const postBrandBrief = async (req, res) => {
    const brandBrief = req.body;

    console.log(brandBrief);
    if(!brandBrief) {
        res.status(400).json({message: "Brand Brief details are empty"});
    }

    try {
        const newBrand = new Brand();
        newBrand._id = brandBrief._id;
        newBrand.name = brandBrief.name;
        newBrand.category = brandBrief.category;
        newBrand.budgetINR = brandBrief.budgetINR;
        newBrand.targetLocations = brandBrief.targetLocations;
        newBrand.targetAges = brandBrief.targetAges;
        newBrand.goals = brandBrief.goals;
        newBrand.tone = brandBrief.tone;
        newBrand.platforms = brandBrief.platforms;
        newBrand.constraints = brandBrief.constraints;
    
        const savedBrand = await newBrand.save();

        res.status(201).json({message: "New Brand Created Successfully", brand: savedBrand});
    } catch (err) {
        res.status(500).json({error: err});
    }
}

export const matchBrandWithCreators = async (req, res) => {
  try {
    const brand = req.body;
    const creators = await Creator.find();

    // 1) Relevance (40%) i.e. [out of 40] distribution: - category (brand) maps to -> pastCategory and verticals of (creators) which carries weightage of 20 - tone (brand) maps to -> tone of (creators) with weightage = 10 - platform (brand) maps to -> platform of (creators) with weightage = 10 observation: category weighs more decision: (number of matched categoried and verticals from audience / categories in brand) * 20 => [grades out of 20] (number of matched tone from audience / tone in brand) * 10 => [grades 10] (number of platforms from audience / platforms in brand) * 10 => [grades 10] so, 
    // in this way relevance gives [out of 40]

    // 2) Audience fit (30%) [out of 30] distribution: - target location (brand) maps to -> audienceGeo (creator) with weightage = 15 - target ages (brand) maps to -> audience age (creator) with weightage = 15 decision: - for location: set sum=0. if city gets matched then add the percent value of that city from audienceGeo to the sum. after every city value is added, multiple sum with 15 to get the grade out of 15. For ages: Check what fraction of creator’s audience falls within the target age range and Multiply that fraction by 15. 
    // in this way Audience Fit is [out of 30]

    // 3) Performance (20%) i.e. [out of 20] distribution: - "Engagement Rate (ER)" weighs out of 5 - Average views weighs out of 5 - Budget (brand) maps to -> BasePrice (creator) with weightage 10 observation: budget weighs more decision: - for ER: if 0 - 0.5 => 1/5 if 0.5 - 1 => 2/5 if 1 - 2 => 3/5 if 2 - 3 => 4/5 if >3 => 5/5 - for avg. views: 0 - 1000 => 1/5 1000 - 5000 => 1.5/5 5000 - 10000 => 2/5 10000 - 50000 => 2.5/5 50000 - 100000 => 3/5 100000 - 250000 => 4/5 >250000 => 5/5
    // for budget: Give full score if basePrice is within budget comfortably and Reduce score gradually if it’s closer to budget.

    // 4) constraint (10%) i.e. [out of 10] if brand wants adult => creator makes adult = 10/10 creator does not makes adult = 0/10 if brand does not wants adult => creator makes adult = 0/10 creator does not makes adult = 10/10

    let results = creators.map((creator) => {
      let totalScore = 0;
      let reasons = [];

      let catMatches = 0;
      brand.category && creator.pastBrandCategories.includes(brand.category) ? catMatches++ : null;
      brand.category && creator.verticals.includes(brand.category) ? catMatches++ : null;

      let categoryScore = (catMatches / 2) * 20; 
      if (categoryScore > 0) reasons.push("Category/Vertical match");

      let toneMatches = creator.contentTone.filter((t) => brand.tone.includes(t)).length;
      let toneScore = (toneMatches / brand.tone.length) * 10;
      if (toneScore > 0) reasons.push("Tone alignment");

      let platformMatches = creator.platforms.filter((p) => brand.platforms.includes(p)).length;
      let platformScore = (platformMatches / brand.platforms.length) * 10;
      if (platformScore > 0) reasons.push("Platform match");

      let relevanceScore = categoryScore + toneScore + platformScore;

      let locSum = 0;
      brand.targetLocations.forEach((loc) => {
        if (creator.audienceGeo[loc]) locSum += creator.audienceGeo[loc];
      });
      let locationScore = locSum * 15;
      if (locationScore > 0) reasons.push("Audience location fit");

      let ageSum = 0;
      let [minAge, maxAge] = brand.targetAges;

      Object.entries(creator.audienceAge).forEach(([range, percent]) => {
        let [low, high] = range.split("-").map(Number);
        if (high >= minAge && low <= maxAge) {
          ageSum += percent;
        }
      });
      let ageScore = ageSum * 15;
      if (ageScore > 0) reasons.push("Audience age fit");

      let audienceFitScore = locationScore + ageScore;

      let er = creator.engagementRate * 100;
      let erScore = 0;
      if (er <= 0.5) erScore = 1;
      else if (er <= 1) erScore = 2;
      else if (er <= 2) erScore = 3;
      else if (er <= 3) erScore = 4;
      else erScore = 5;
      if (erScore > 0) reasons.push("Good engagement");

      let viewScore = 0;
      let v = creator.avgViews;
      if (v < 1000) viewScore = 1;
      else if (v < 5000) viewScore = 1.5;
      else if (v < 10000) viewScore = 2;
      else if (v < 50000) viewScore = 2.5;
      else if (v < 100000) viewScore = 3;
      else if (v < 250000) viewScore = 4;
      else viewScore = 5;
      if (viewScore > 0) reasons.push("Strong views");

      let budgetScore = 0;
      if (creator.basePriceINR <= brand.budgetINR) {
        let ratio = brand.budgetINR / creator.basePriceINR;
        if (ratio >= 2) budgetScore = 10;
        else if (ratio >= 1) budgetScore = 7;
        else if (ratio >= 0.8) budgetScore = 5;
      } else {
        budgetScore = 0;
      }
      if (budgetScore > 0) reasons.push("Within budget");

      let performanceScore = erScore + viewScore + budgetScore;

      let constraintScore = 0;
      if (brand.constraints.noAdultContent) {
        constraintScore = creator.safetyFlags.adult ? 0 : 10;
      } else {
        constraintScore = creator.safetyFlags.adult ? 10 : 0;
      }
      if (constraintScore === 10) reasons.push("Meets safety constraint");

      totalScore = relevanceScore + audienceFitScore + performanceScore + constraintScore;

      return {
        creatorId: creator._id,
        handle: creator.handle,
        totalScore,
        reasons,
      };
    });

    // SORT results ACCORDING TO SCORE
    results.sort((a, b) => b.totalScore - a.totalScore);

    res.status(200).json({message: "success", results: results});

  } catch (error) {
    console.error(error);
    res.status(500).json({error: error});
  }
};