const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), (req, res) => {
    res.redirect("/shop");
})
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})
router.post("/signup", wrapAsync(async (req, res, next) => {
   try{
    let { username, email, password } = req.body;
    
    let user = new userModel({ email, username });
    const registerUser = await userModel.register(user, password);

    req.login(registerUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Scatch");
        res.redirect("/shop");
    });
   }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup")
   }
}));

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out! Come back soon.");
        res.redirect("/shop");
    });
});

//Payment status
router.get("/confirm", isLoggedIn, wrapAsync(async(req, res) => {
    const user = await userModel.findById(req.user._id);    
    user.cart = []; 
    await user.save();
    req.flash("success", "Your payment was successful!");
    res.redirect("/shop");
}));
router.get("/failed", isLoggedIn, (req, res) => {
    req.flash("error", "Payment was declined. Please try again.");
    res.redirect("/shop/cart");
})

module.exports = router;