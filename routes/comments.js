var express 	=	require("express"),
	router		=	express.Router({mergeParams: true}),
	Item 		=	require("../models/item"),
	Comment 	=	require("../models/comment"),
	Middleware  = 	require("../middleware");


//COMMENT route: NEW - show form to comment
router.post("/add", Middleware.isLoggedIn, function(req, res){
		Item.findById(req.params.id, function(err, item){
			if(err){
				req.flash("error", err.message);
			} else {
				Comment.create(req.body.comment, function(err, comment){
					if(err){
						req.flash("error", err.message);
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
		req.flash("success", "Comment has been added.")
		res.redirect("/items/" + req.params.id);
});

//COMMENT route: EDIT - edit comment
router.put("/:id2/edit", Middleware.checkCommentOwnership, function(req, res){
	
	Comment.findByIdAndUpdate(req.params.id2, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", err);
		} else {
			req.flash("success", "Comment is updated");
			res.redirect("/items/" + req.params.id);
		}
	});
});

//COMMENT route: DELETE - delete comment
router.delete("/:id2/delete", Middleware.checkCommentOwnership, function(req, res){
	Comment.deleteOne({_id: req.params.id2}, function(err){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/items/" + req.params.id);
		}
	});
});


module.exports = router;