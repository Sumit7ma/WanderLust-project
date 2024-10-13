const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type:String,
        required:true,  
    },

    image:{
        // url:{
        // type: String,
        // default:"https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
        // set:(v)=>(v === "" ?"https://picsum.photos/id/1/200/300"
        // : v),
        // }
        //changing because we upload img inside the cloud

        url:String,
        filename: String,

    }, 

    price: Number,
    location: String,
    country: String, 
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref: "Review",

        
        },
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

    // mnao
    geometry: {
        type: {
            type: String, // 'Point'
            enum: ['Point'], // Must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

});


//we use this to delete the reviews of the post automatic when we delete the post automatic
// this is schema middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


