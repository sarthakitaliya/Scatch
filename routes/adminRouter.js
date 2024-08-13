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
const {productSchema} = require("../schema.js")

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
    req.flash("success", "Product added");
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


module.exports = router;