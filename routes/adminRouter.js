const express = require("express");
const router = express.Router();
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const {isAdmin} = require("../middleware.js");
const productModel = require("../models/productModel.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userModel = require("../models/userModel.js");
const {productSchema} = require("../schema.js");
const { model } = require("mongoose");
const orderModel = require("../models/orderModel.js");

router.get("/", isAdmin, (req, res) => {
    res.render("admin/dashboard");
})
router.get("/add", isAdmin,(req, res) => {
    res.render("admin/add");
});
router.post("/add", isAdmin, upload.single('image'), wrapAsync( async (req, res) => {
    let result = productSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error)
    }
    let {productname, price, discount, bgcolor, panelcolor, textcolor} = req.body;
    let url = req.file.url;
    let filename = req.file.public_id;
    let newProduct = new productModel({
        image: {url, filename},
        productname,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    }) 
    
    await newProduct.save();
    let admin = await userModel.findOne({role: 'admin'});
    admin.products.push(newProduct._id);
    await admin.save();
    
    req.flash("success", "Product added");
    res.redirect("/admin/list");
}))
router.get("/list", isAdmin, wrapAsync(async (req, res) => {
    let allProducts = await productModel.find({});
    res.render("admin/listOrder", {allProducts});
}));

router.delete("/list/:id", isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    req.flash('success', 'Product deleted');
    res.redirect('/admin/list');
}));

router.get("/orders", wrapAsync(async(req, res) => {
    let user = await userModel.find({role: "user"})
    .populate({
        path: 'orders',
        populate:{
            path:'products.product',
            model:'product'
        }
    })
    // res.send(user)
    res.render("admin/orders", {user});
}))
router.post("/orders/:orderId", wrapAsync(async(req, res) => {
    const {orderId} = req.params;
    const { status } = req.body;
    
    const order = await orderModel.findByIdAndUpdate(orderId, {status: status});
    
    if (!order) {
        req.flash("error", "Order not found.");
        return res.redirect("/admin/orders");
    }
    req.flash("success", "Order status updated successfully.");
    res.redirect("/admin/orders");
}))

module.exports = router;