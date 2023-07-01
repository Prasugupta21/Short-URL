const express=require("express");
const urlRoute=require("./routes/url");
const URL=require("./models/url");
const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth")
const cookieParser=require("cookie-parser");
const path=require("path");
const {connectToMongoDB}=require("./connection");
const staticRouter=require("./routes/staticRouter");
const userRouter=require("./routes/user")

const app=express();



connectToMongoDB("mongodb://127.0.0.1:27017/shortUrl").then(()=>{
    console.log("Mongodb connected");
}).catch(err=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(express.json());
app.use("/",checkAuth,staticRouter);
app.use("/user",userRouter);
app.use("/url",restrictToLoggedinUserOnly,urlRoute);


app.get("/url/:shortId",async (req,res)=>{
const shortId=req.params.shortId;
const entry =await URL.findOneAndUpdate({
    shortId
},{$push:{
    visitHistory:{
        timestamp:  Date.now(),
    }
      
},});
return res.redirect(entry.redirectUrl);
});

app.listen(4000,()=>{
    console.log("server started on port 4000");
})