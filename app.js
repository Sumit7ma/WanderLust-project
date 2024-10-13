//require the dotenv used to read and operate the env file  
if(process.env.NODE_ENV!="production"){
require('dotenv').config();

};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");//the all thing is for user
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const cookie = require("express-session/session/cookie.js");


// this local host link 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


// this is atlas link
const dburl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log("the err is ",err);
})


async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");// Set EJS as the templating engine
app.set("views", path.join(__dirname,"views"));// Set the views directory
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies
app.use(methodOverride("_method"));//method override
app.use(express.json());
app.engine("ejs",ejsMate);// Use EJS Mate for EJS layouts
app.use(express.static(path.join(__dirname,"/public")));// Serve static files from the 'public' directory

const store = MongoStore.create({
    mongoUrl: dburl,
    secret:process.env.SECRET,

//used to auto refresh
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    //we pass the expire date and max age
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7*27*60*60*1000,
        httpOnly:true,
    },
};

//middleware for the session

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//authenticate is inbuild method

// we take this 2 line from the npm
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;

next();
})




// // for user
// app.get("/demouser",async(req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student1"
//     });
//     //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//     let registeredUser = await  User.register(fakeUser, "helloword");
//     res.send(registeredUser)
// }) 

//this is way the user data save {
  //"email": "student@gmail.com",
  //"_id": "66fc14fe5686790c14706888",
  //"username": "delta-student1",
  //"salt": "c10f23af9943e520f503e035271f326ffff704fe7faa14bd0029ba146a8bfc7d",
  //"hash": "bf05c683f4680ace0ca33b84b63a24cbf64dc4752a6de4ebe07d6373012b9a5fac6bea4e6480efee4f373929

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.all("*",(req, res, next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500, message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is properly working");
});

