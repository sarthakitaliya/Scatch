const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const engine = require("ejs-mate");

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.engine("ejs", engine)

app.listen(3000);

app.get("/a", (req, res) => {
    res.render("user/shop.ejs")
})

