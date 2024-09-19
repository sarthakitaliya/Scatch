if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const engine = require("ejs-mate");
const mongoose = require("mongoose")
const indexRouter = require("./routes/indexRoute");
const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash"); 
const userModel = require("./models/userModel")
const multer = require("multer");
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const dburl = process.env.ATLASDB_URL;  


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.engine("ejs", engine)

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dburl,
        crypto: {
            secret: "secret"
        },
        touchAfter: 24 * 3600
    }),
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());
app.listen(3000);

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
//Routes
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/shop", userRouter);

const MONGO_URL = "mongodb://127.0.0.1:27017/scatch";
main().then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
})
async function main(){
    await mongoose.connect(dburl);
}

app.all("*", (req, res, next) => {    
    next(new ExpressError(404, "Page not Found"))
})

app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong"} = err;
    res.status(status).render("error", {message, status});
})

