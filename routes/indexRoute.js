const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

router.get('/', (req, res) => {
    res.redirect('/shop');
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
function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        const productPrice = item.productId.price;
        return total + (productPrice * item.quantity);
    }, 0);
}

//Payment status
router.get("/confirm", isLoggedIn, wrapAsync(async(req, res) => {
    const userId = req.user._id;
    const user = await userModel.findById(userId).populate('cart.productId');

    if(!user || user.cart.length == 0){
        req.flash("error", "You have no items in your cart");
        return req.redirect("/shop")
    }

    let totalAmount = 0;
    const orderProducts = user.cart.map(item => ({
        product: item.productId || item.productId._id, 
        quantity: item.quantity,
    }));    
    const newOrder = new orderModel({
        user: userId,
        products: orderProducts,
        totalAmount: calculateTotal(user.cart),
    })
    await newOrder.save();    

    user.cart = []; 
    user.orders.push(newOrder._id);

    await user.save();
    
    req.flash("success", "Your payment was successful!");
    res.redirect("/shop/orders");
}));
router.get("/failed", isLoggedIn, (req, res) => {
    req.flash("error", "Payment was declined. Please try again.");
    res.redirect("/shop/cart");
})

module.exports = router;