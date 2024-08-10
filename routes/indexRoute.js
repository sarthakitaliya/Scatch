const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const passport = require("passport");

router.get("/shop", (req, res) => {
    res.render("user/shop.ejs")
});

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), (req, res) => {
    res.redirect("/shop");
})
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})
router.post("/signup", async (req, res) => {
    let {username, email, password} = req.body; 
    let user = new userModel({
        email,
        username
        });
    const registerUSer = await userModel.register(user, password)
    res.redirect("/shop");
})

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out! Come back soon.");
        res.redirect("/shop");
    });
});

module.exports = router;