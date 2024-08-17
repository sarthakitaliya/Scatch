const express = require("express");
const router = express.Router();
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const {isAdmin} = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const adminController = require("../controllers/adminController.js");

router.get("/", isAdmin, adminController.adminDashboard)
router.get("/add", isAdmin,adminController.renderAddPage);
router.post("/add", isAdmin, upload.single('image'), wrapAsync(adminController.addFormSubmit));
router.get("/list", isAdmin, wrapAsync(adminController.renderListPage));

router.delete("/list/:id", isAdmin, wrapAsync(adminController.removeList));

router.get("/orders", wrapAsync(adminController.renderOrdersPage));

router.post("/orders/:orderId", wrapAsync(adminController.orderStatus))

module.exports = router;