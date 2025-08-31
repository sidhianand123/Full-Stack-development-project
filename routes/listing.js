const express= require("express");
const router= express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const {validateListing} = require("../middleware.js");
const { isLoggedIn ,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')//middleware for handling multipart/form-data, which is primarily used for uploading files
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage}); //specifying the storage engine




router
  .route("/")
  //Index Route
  .get(wrapAsync (listingController.index))
  //Create Route
  .post(
  isLoggedIn,
  validateListing,
  upload.single('listing[image][url]'),
  
  wrapAsync ( listingController.createListing)
);
  
//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm );

// Search Route
router.get("/search", wrapAsync( listingController.search));
 
router.route("/:id")
//Show Route
 .get(wrapAsync( listingController.showListing))
//Update Route
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  upload.single('listing[image][url]'),

  wrapAsync( listingController.updateListing)
  )
  //Destroy Route
  .delete(
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.destroyListing)
  );

  //Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync( listingController.renderEditForm)
);



//Exporting the router
module.exports = router;