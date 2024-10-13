const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 
main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log("the err is ",err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    // Create a new array with the owner property added
    const initializedData = initData.data.map((obj) => ({
        ...obj,
        owner: "66fc26af3f0e56bfa301b9b1"
    }));
    
    // Insert the new array with the owner property
    await Listing.insertMany(initializedData);
    console.log("Data was initialized");
};


initDB();
