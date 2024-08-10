const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("admin/dashboard");
})
router.get("/add", (req, res) => {
    res.render("admin/add");
});
router.get("/list", (req, res) => {
    res.render("admin/listOrder");
});

module.exports = router