const Listing  = require("../models/listing");
//for the map geocoding look documentation 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res)=>{
    //this is collection into bd as Listing we just use one mongo query to insert all the data into allListing
   const allListings =await Listing.find({});

   //call the "index.ejs" and provide all the listings we insert into the allListing veriable
   res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{

    // console.log(req.user);
   
    res.render("listings/new.ejs");
};


module.exports.showListing = async(req,res)=>{
    let {id} = req.params;// Extract the id from the URL parameters
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
    populate:{
        path:"author",
    },
})
    .populate("owner");// populate bring the data related to listing from db 

    //USED WHEN THE LISTING ID NOT PRESEND WE USE FLASH THAT LISTING NOT PRESENT
    if(!listing){
        req.flash("error","listing not exist ! ");
        res.redirect("/listings");  
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});// Find a listing by its id

};

module.exports.createListing = async(req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        
        limit: 1
      })
        .send();
   
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);

    // we take the owner detail inside the listing by request the id of the owner store all the value of owner
     newListing.owner = req.user._id;
     newListing.image = {url, filename};
   
    newListing.geometry = response.body.features[0].geometry; 

    let savedListing = await newListing.save();//save the newlisting to the database

    console.log(savedListing);
    req.flash("success","New Listing has been created");    
    res.redirect("/listings");// Redirect to the index route to display all listings
   
   
};

module.exports.renderEditForm = async(req,res)=>{
    let{id} = req.params; // Extract the id from the URL parameters
    const listing = await Listing.findById(id); // Find the listing by its id
   
    //USED WHEN THE LISTING ID NOT PRESEND WE USE FLASH THAT LISTING NOT PRESENT
    if(!listing){
        req.flash("error","listing not exist ! ");
        res.redirect("/listings");  
    }

    // used to blur image we add some thing from cloud to the url and then pass to ejs page
    
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{ listing , originalImageUrl}); // Render the edit.ejs view and pass the listing to it
};

module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;// Extract the id from the URL parameters
   
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    //in if condition we cheak the user try to edit the image or not in hr upload new image then only the if condition execute
    //bacaue in req.file include only the image

    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    } 

    req.flash("success","Your listing has been updated");
    // the ... syntax is called the spread operator in JavaScript.
    res.redirect(`/listings/${id}`);// Redirect to the show route to see the updated listing
};

module.exports.destroyListiing = async(req,res)=>{
    let{id} = req.params;// Extract the id from the URL parameters
    let deleteListing = await Listing.findByIdAndDelete(id); // Find the listing by its id and delete it
    req.flash("success","listing deleted");
    res.redirect("/listings"); // Redirect to the index route to display all remaining listings
};