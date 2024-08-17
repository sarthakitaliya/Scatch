const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const {signupSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.renderShop = (req, res) => {
    res.redirect('/shop');
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs")
}

module.exports.login = (req, res) => {
    res.redirect("/shop");
}

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;
    let result = signupSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    let user = new userModel({ email, username });
    const registerUser = await userModel.register(user, password);

    req.login(registerUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Scatch");
        res.redirect("/shop");
    });
 }

 module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out! Come back soon.");
        res.redirect("/shop");
    });
}
function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        const productPrice = item.productId.price;
        return total + (productPrice * item.quantity);
    }, 0);
}
module.exports.paymentConfirm = async(req, res) => {
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
}

module.exports.paymentFailed = (req, res) => {
    req.flash("error", "Payment was declined. Please try again.");
    res.redirect("/shop/cart");
}