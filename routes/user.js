const express= require("express");
const router= express.Router();
const user= require("../models/user.js");
const wrapAsync=require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}= require("../middleware.js");

const userController=require("../controllers/users.js");

router
 .route("/signup")
  .get(userController.renderSignupForm) //Signup Route
  .post(wrapAsync(userController.signup)) ;//signup Logic

router
.route("/login")
.get(userController.renderLoginForm)//Login Route
.post(
    
    saveRedirectUrl,
    passport.authenticate("local",{
        failureFlash:true,
        failureRedirect:"/login"
    }),
    userController.login
    ); //Login Route


//Logout Route
router.get("/logout",userController.logout);

//Exporting router
module.exports=router;