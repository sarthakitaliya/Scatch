const mongoose = require("mongoose");
const userModel = require("./userModel");


const productSchema = mongoose.Schema({
    image: {
        url: String,
        filename: String
    },
    productname: String,
    price: Number,
    discount:{
        type: Number,
        default: 0
    },
    bgcolor:{
        type: String
    },
    panelcolor: String,
    textcolor: String
});

productSchema.post('findOneAndDelete', async function (product) {
    if (product) {
        // Remove the product from all admins' products array
        await userModel.updateMany(
            { role: 'admin' },
            { $pull: { products: product._id } }
        );
    }
});

module.exports = mongoose.model("product", productSchema);
