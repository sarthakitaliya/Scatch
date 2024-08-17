const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const indexController = require("../controllers/indexController");

router.get('/', indexController.renderShop);

router.get("/login", indexController.renderLoginForm)

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), indexController.login)
router.get("/signup", indexController.renderSignupForm);

router.post("/signup", wrapAsync(indexController.signup));

router.get("/logout", isLoggedIn, indexController.logout);

//Payment status
router.get("/confirm", isLoggedIn, wrapAsync(indexController.paymentConfirm));
router.get("/failed", isLoggedIn, indexController.paymentFailed)

module.exports = router;