//we use this for 3rd middleware
const Listing = require("./models/listing");
const Review = require("./models/review");
//this is for 4th and 5th
const ExpressError = require("./utils/ExpressError.js");
const{ listingSchema ,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {

    // console.log(req.path,"..",req.originalUrl);
    
    if (!req.isAuthenticated()) {
        //Yes, the line req.session.redirectUrl = req.originalUrl; saves the current URL (req.originalUrl) to the session object, 
        //which is stored on the server-side (not in a cookie directly). However,  
        //session  data is usually associated with a session ID that is stored in a cookie in the user's browser.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();  
};
//when the passport access the login it delete all the pre existing session data that we store so we have it inside the locals so it dont delete it

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let{id} = req.params;// Extract the id from the URL parameters
    let listing = await Listing.findById(id);// Update the listing with new data

    // we can also do this like this
    // const ownerId = listing.owner._id.toString();
    // const userId = res.locals.currUser._id.toString();

    // if (ownerId !== userId) {
    // // Owner match logic


    
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Your not the Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.validateListing = (req,res,next) => {
    let {error} =listingSchema.validate(req.body);
    if(error){
    
        ////this code is for extra to short the err message not that imp ok 
        //thsi code is important for 
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg );
    }
    else{
        next(); 
    }
};



module.exports.validateReview = (req,res,next) => {
    let {error} =reviewSchema.validate(req.body);
    if(error){ 
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next(); 
    }
};


module.exports.isReviewAuthor = async(req, res, next)=>{
    let{id, reviewId} = req.params;// Extract the id from the URL parameters
    let review = await Review.findById(reviewId).populate('author');
// Update the listing with new data
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Your not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};