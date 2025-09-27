const shortid = require('shortid');
const Url = require('../model/url');
async function handleGenerateShortUrl(req, res) {
    const body= req.body;
    if(!body.redirectUrl){
        return res.status(400).json({error: "redirectUrl is required"});
    }
    const ShortId= shortid();
    
    await Url.create({
        shortId: ShortId,
        redirectUrl: body.redirectUrl,
    });

    return res.json({id: ShortId});
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const entry = await Url.findOne({ shortId: shortId });
    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    return res.json({
        totalClicks: entry.totalClicks,
        analytics: entry.createdAt
    });
}


module.exports = { handleGenerateShortUrl ,
    handleGetAnalytics
};
