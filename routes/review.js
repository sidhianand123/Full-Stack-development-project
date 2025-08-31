const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { merge } = require("./listing.js");//to access :id from listing routes
const { validateReview ,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//REVIEW ROUTES 

//Post REVIEW  Route

router.post("/",
  isLoggedIn,
  validateReview, 
  wrapAsync(reviewController.createReview)
  );

//Delete REVIEW Route
router.delete(
  "/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
   wrapAsync(reviewController.destroyReview)
);

module.exports = router;