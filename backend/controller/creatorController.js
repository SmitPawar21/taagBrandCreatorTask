import Creator from "../models/Creator.js";

export const getAllCreators = async (req, res) => {
    try {
        const creators = await Creator.find();

        res.status(201).json({message: "success", creators: creators});
    } catch (err) {
        res.status(500).json({error: err});
    }
}

export const postOneCreator = async (req, res) => {
    const creatorData = req.body;

    if(!creatorData) {
        res.status(400).json({message: "Creator Data is Empty"});
    }

    try {
        const newCreator = new Creator();
        newCreator._id = creatorData._id;
        newCreator.handle = creatorData.handle;
        newCreator.verticals = creatorData.verticals;
        newCreator.platforms = creatorData.platforms;
        newCreator.audienceGeo = creatorData.audienceGeo;
        newCreator.audienceAge = creatorData.audienceAge;
        newCreator.avgViews = creatorData.avgViews;
        newCreator.engagementRate = creatorData.engagementRate;
        newCreator.pastBrandCategories = creatorData.pastBrandCategories;
        newCreator.contentTone = creatorData.contentTone;
        newCreator.safetyFlags = creatorData.safetyFlags;
        newCreator.basePriceINR = creatorData.basePriceINR;
        newCreator._id = creatorData._id;

        const savedCreator = await newCreator.save();

        res.status(201).json({"message": "success", creator: savedCreator});
    } catch (err) {
        res.status(500).json({error: err});
    }

}