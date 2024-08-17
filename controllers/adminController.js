const orderModel = require("../models/orderModel.js");
const sendOrderUpdateEmail = require("../utils/sendEmail.js");
const {productSchema} = require("../schema.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js")
const ExpressError = require("../utils/ExpressError.js");

module.exports.adminDashboard = (req, res) => {
    res.render("admin/dashboard");
}

module.exports.renderAddPage = (req, res) => {
    res.render("admin/add");
}
module.exports.addFormSubmit = async (req, res) => {
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
}
module.exports.renderListPage = async (req, res) => {
    let allProducts = await productModel.find({});
    res.render("admin/listOrder", {allProducts});
}
module.exports.removeList = async (req, res) => {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    req.flash('success', 'Product deleted');
    res.redirect('/admin/list');
}
module.exports.renderOrdersPage = async(req, res) => {
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
}
module.exports.orderStatus = async(req, res) => {
    const {orderId} = req.params;
    const { status } = req.body;
    
    const order = await orderModel.findByIdAndUpdate(orderId, {status: status}).populate('user');
    if (order) {
        console.log(order);
        
        sendOrderUpdateEmail(order.user.email, order._id, status);
        req.flash('success', 'Order status updated successfully.');
    }else{
        req.flash("error", "Order not found.");
        return res.redirect("/admin/orders");
    }
    res.redirect("/admin/orders");
}