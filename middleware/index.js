var Item 		=	require("../models/item")
 	Comment 		=	require("../models/comment");
var Middleware = {};
 
Middleware.checkItemOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Item.findById(req.params.id, function(err, foundItem){
			if(err){
				res.redirect("/items/" + req.params.id);
			}
			if(foundItem.customer && foundItem.customer.id.equals(req.user._id)){
				next();
			} else {
				res.redirect("/items/" + req.params.id);
			}
		});
	}
}


Middleware.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.id2, function(err, foundComment){
			if(err){
				res.redirect("/items/" + req.params.id);
			}
			if(foundComment.customer && foundComment.customer.id.equals(req.user._id)){
				next();
			} else {
				res.redirect("/items/" + req.params.id);
			}
		});
	}
}


Middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
}

module.exports = Middleware;