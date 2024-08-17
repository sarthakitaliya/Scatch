const userModel = require("../models/userModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const productModel = require("../models/productModel.js");

module.exports.renderShopPage = async (req, res) => {
    const products = await productModel.find({});
    res.render("user/shop.ejs", {products, user: req.user});
}
module.exports.renderCartPage = async(req, res) => {
    const user = await userModel.findById(req.user._id).populate('cart.productId');
    res.render("user/cart.ejs", {cart: user.cart});
}
module.exports.cartUpdate = async (req, res) => {
    const { productId, action } = req.body;
    
    const user = await userModel.findById(req.user._id);
    const cartItem = user.cart.find(item => item.productId.toString() === productId);

    if (action === 'increase') {
        cartItem.quantity += 1;
    } else if (action === 'decrease' && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    }

    await user.save();
    res.redirect('/shop/cart');
}
module.exports.renderOrdersPage = async(req, res) => {
    const user = await userModel.findById(req.user._id)
    .populate({
        path: 'orders',
        populate:{
            path:'products.product',
            model:'product'
        }
    });
    res.render("user/orders.ejs", {user});
}
module.exports.addCart = async(req, res) => {
    let userId = req.user.id;
    let productId = req.params.id;
    await userModel.findByIdAndUpdate(userId, { $push: { cart: { productId: productId, quantity: 1 } } });
    res.redirect("/shop")
}
module.exports.removeCart = async(req, res) => {
    const {productId} = req.params;
    const userId = req.user._id;

    await userModel.findByIdAndUpdate(userId, {$pull: {cart: {productId: productId}}});

    res.redirect("/shop/cart")
}
module.exports.promoSubmit = (req, res) => {
    req.flash("error", "The promo code you entered does not exist")
    res.redirect("/shop/cart");
}
module.exports.paymentCheckout = async(req, res) => {
    const user = await userModel.findById(req.user._id).populate('cart.productId');
    if(!user){
        req.flash("error", "You must have to login");
        return res.redirect("/shop");
    }
    if (user.cart.length === 0) {
        req.flash('error', 'Your cart is empty.');
        return res.redirect('/shop/cart');
    }
    const lineItems = user.cart.map(cartItem => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: cartItem.productId.productname, 
                    images: [cartItem.productId.image.url] 
                },
                unit_amount: cartItem.productId.price * 100,
            },
            quantity: cartItem.quantity
        };
    });
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/confirm`,    
        cancel_url: `${process.env.BASE_URL}/failed`,
    })
    
    res.redirect(session.url);
}