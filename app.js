const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const engine = require("ejs-mate");
const mongoose = require("mongoose")
const indexRouter = require("./routes/indexRoute");
const adminRouter = require("./routes/adminRouter");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash"); 
const userModel = require("./models/userModel")

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.engine("ejs", engine)

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
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

const MONGO_URL = "mongodb://127.0.0.1:27017/scatch";
// const dburl = process.env.ATLASDB_URL;
//connect to DB
main().then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


