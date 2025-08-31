const user=require("../models/user.js");

//Signup Route
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//Signup Logic
module.exports.signup =async (req, res) => {
    try{
       let {email,username,password}= req.body;
       const newUser= new user({email,username});
       const registeredUser= await user.register(newUser,password);//register method added by passport
       console.log(registeredUser);
       req.login(registeredUser,err=>{   //to log in the user immediately after signing up
        if(err){
            return next(err);   
        }
        req.flash("success","Welcome to Wanderlust");
       res.redirect("/listings");
       });
       
    }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
    }
    
    };
//Login Route
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

//Login Logic
module.exports.login= async (req,res)=>{
     req.flash("success","Welcome Back!");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); ;
};

module.exports.logout=(req,res,next)=>{
     req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","you are Logged  out!");
        res.redirect("/listings");
      });
};