const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");

//Middleware to check if user is logged in
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to access that page!");
        req.session.redirectUrl= req.originalUrl; //to store the url the user is requesting before being redirected to login 
        return res.redirect("/login");
        
    }
    next();
};

//Middleware to save the redirect URL in locals for access in templates
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next();
};

//Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing!");
      return res.redirect(`/listings/${id}`);
     }
     next();
    };

//Validation for Listing schema
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
       throw new ExpressError(400,errMsg);
   }else{
    next();
   }
};

//Validation for Review schema
module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }  
  else{
    next();
  }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this lreview!");
      return res.redirect(`/listings/${id}`);
     }
     next();
    };
