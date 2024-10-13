// re   quir efrom the documentation
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//we try to connect with cloudinary by using config
cloudinary.config({
    //taking valur from the env page 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    
})

//we define the storage from the documentation of the multer-storage-cloudnary it is like google drive create folder

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        //name of folder
      folder: 'wanderlust_DEV',
      //which type of dtaa is allowed inside that storage 
      allowedFormats: ["png","jpg","jpeg","pdf"], // supports promises as well
      
    },
  });
module.exports={
    cloudinary,
    storage,
};// now we use this inbside of the listing.js(post route for the creating new listing)
