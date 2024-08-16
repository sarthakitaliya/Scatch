const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    email: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cart: [
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order'
        }
    ],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }]
});

userSchema.plugin(plm);


module.exports = mongoose.model("user", userSchema);
