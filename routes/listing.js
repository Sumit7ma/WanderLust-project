const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing } = require("../middleware");
const listingController = require("../controllers/lisitngs.js");
//used for upload image
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")

// main route for the listing list(1)
.get(wrapAsync(listingController.index))



//create Route(2) including validatelisting middleware into this route
 .post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));



//New Route(2)
router.get ("/new",isLoggedIn, listingController.renderNewForm);// Render the new.ejs view for creating a new listing



router.route("/:id")

//show Route (3)
.get(wrapAsync(listingController.showListing))

//update Route(4)
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))

//delete route(5)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListiing));





//Edit Route(4)
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;