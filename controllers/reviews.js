const Listing = require("../models/listing"); 
const Review = require("../models/review");



module.exports.createReview = async(req,res)=> {
    console.log(req.params.id );
    // 66fd1199707a57540e55f7c9 

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
//{
//       comment: 'ss',
//       rating: 3,
//       createdAt: 2024-10-06T17:47:38.961Z,
//       _id: new ObjectId('6702cd59a7e63e717287bafe'),
//       author: new ObjectId('66fcea760ac080491ed99668')
//     } 


    //we can pass the entire newReview to the lsiting but in listign schema we design like it take only the id os review so dont dont matetr but we still pass direct id
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.distroy = async(req, res)=>{
    
    let{ id, reviewId } = req.params;
   
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
};