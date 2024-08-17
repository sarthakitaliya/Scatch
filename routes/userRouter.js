const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

const userController = require("../controllers/userController.js");

router.get("/", wrapAsync(userController.renderShopPage));

router.get("/cart", isLoggedIn, wrapAsync(userController.renderCartPage));

router.post('/cart/update', isLoggedIn, wrapAsync(userController.cartUpdate));

router.get("/orders", isLoggedIn, wrapAsync(userController.renderOrdersPage));

router.get("/:id", isLoggedIn, wrapAsync(userController.addCart));

router.post("/cart/remove/:productId", isLoggedIn, wrapAsync(userController.removeCart));

router.get("/cart/promo", userController.promoSubmit);

router.post("/cart/checkout", isLoggedIn, wrapAsync(userController.paymentCheckout));

module.exports = router;