const express = require("express");
//the thing we add inside the express route is a external process to send the value of perant to child
//paranat is the value of route we create inside the app.js is which is same for the every route inside this class
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isReviewAuthor,validateReview } = require("../middleware");
const  reviewController  = require("../controllers/reviews.js");



//Reviews
//POST Route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.distroy));

module.exports = router;