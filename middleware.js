const { productSchema } = require("./schema");  
productSchema
module.exports.isAdmin = (req, res, next) => {
    if (!req.user) { 
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login"); 
    }
    if (req.user.role !== 'admin') {
        req.flash("error", "Access Denied");
        res.redirect("/shop")
        return res.status(403).send({ error: 'Access denied.' });
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user) { 
        req.flash("error", "You must be logged in.");
        return res.redirect("/login"); 
    }
    next();
}
module.exports.validate = (req, res, next) => {
    let {error} = productSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    }else{
        next();
    }
}