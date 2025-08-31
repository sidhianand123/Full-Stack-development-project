//load environment variables from .env file
if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}


//import necessary modules
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//import routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//Database connection


const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected successfully")
}).catch(err=>{
   console.log(err) ;
})
async function main(){
    await mongoose.connect(dbUrl);
}

//Middleware
app.engine("ejs",ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

//Session store configuration
const store = MongoStore.create({
  mongoUrl: dbUrl,
 crypto:{
  secret: process.env.SECRET,
 },
 touchAfter: 24 * 60 * 60 // time period in seconds
});

store.on("error", ()=>{
  console.log("session store error",err);
}); 

// Configure session options
const sessionOptions = {
  store,
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24* 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true, 
 }
};


//Use session and flash middlewares
app.use(session(sessionOptions));   
app.use(flash());    

//Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//static method added by passport-local-mongoose to User model to authenticate users

passport.serializeUser(User.serializeUser());//static method added by passport-local-mongoose to User model to store user in session
passport.deserializeUser(User.deserializeUser());//static method added by passport-local-mongoose to User model to remove user from session


//Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
 
  
  next();
});




//Listing and Review Routes and User Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//error handling middlewares
app.all(/.*/, (req, res, next) =>{
  next(new ExpressError(404,"Page Not Found !"));
});



app.use((err,req,res, next) =>{
  let {statusCode=500,message="something went wrong"} =err;
  res.status(statusCode).render("error.ejs",{message});
});




//Start the server
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});