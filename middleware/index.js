var Middleware = {};
 
Middleware.checkItemOwnership = function(req, res, next){
	
}




 Middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    //req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = Middleware;