const User = require("../models/user");




module.exports.renderSignupForm= (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{

    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    // this is inbuild function
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust !");
        res.redirect("/listings");
    });
    
    } catch(e){
        req.flash("error","user aleady present");
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
    };


module.exports.login =  async(req,res)=>{
//failureRedirect: '/login' = this is used to redirect the page if the authenticate fail , failureFlash: true = this is true means the we can print the flash message if the authen fail
req.flash("success","welcome back to wanderlust your login");
//there is one problem when we direct click on the login this is not call the listing pade because url is undefined
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}


module.exports.logout = (req,res,next)=>{
    
    //this is inbuild function
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    });
};