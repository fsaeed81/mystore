var express 	=	require("express"),
	router		=	express.Router(),
	Item 		=	require("../models/item"),
	Comment 	=	require("../models/comment"),
	Middleware  = 	require("../middleware");


//COMMENT route: NEW - show form to comment
router.post("/add", Middleware.isLoggedIn, function(req, res){

		Item.findById(req.params.id, function(err, item){
			if(err){
				console.log(err);
			} else {
				Comment.create(req.body.comment, function(err, comment){
					if(err){
						console.log(err);
					} else {
						comment.customer.id = req.user._id;
						comment.customer.username = req.user.username;
						comment.save();

						item.comments.push(comment);
						item.save();
					}
				});
			}
		});
		res.redirect("/items/" + req.params.id);
});

//COMMENT route: DELETE - delete comment
router.post("/:id2/delete", Middleware.isLoggedIn, function(req, res){
	Comment.deleteOne({_id: req.params.id2}, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});


module.exports = router;