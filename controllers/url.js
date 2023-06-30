
const shortid=require("shortid");
const URL=require("../models/url");
async function handleGenerateShortUrl(req,res){

const body=req.body;
if(!body.url){
    res.status(400).json({error:"url is required"});

}
const shortID=shortid();
await URL.create({
    shortId:shortID,
    redirectUrl:body.url,
    visitHistory:[]
});
res.render("home",{id:shortID});
// res.json({id:shortID});

}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    res.json({totalClicks:result.visitHistory.length,
    analytics:result.visitHistory})

}
module.exports={
    handleGenerateShortUrl,
    handleGetAnalytics
}