const express = require("express");
const router = express.Router();


router.get("/shop", (req, res) => {
    res.render("user/shop.ejs")
});

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
})

module.exports = router;