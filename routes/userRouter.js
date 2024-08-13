const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const productModel = require("../models/productModel");
const { isLoggedIn } = require("../middleware");


router.get("/", wrapAsync(async (req, res) => {
    const products = await productModel.find({});
    res.render("user/shop.ejs", {products});
}));

router.get("/cart", isLoggedIn,(req, res) => {
    res.render("user/cart.ejs");
})
module.exports = router;