var express		= 	require("express"),
	router		=	express.Router(),
	Item  		= 	require("../models/item"),
	Middleware  = 	require("../middleware");

//route: INDEX - show all items
router.get("/", function(req, res){
	Item.find({}, function(err, items){
		if (err){
			console.log(err);
		} else {
			res.render("items/index", {items: items});
		}
	});


	
});

//route: NEW - show form to create new item
router.get("/new", function(req, res){
	res.render("items/new");
});

// route: CREATE - add new item to db
router.post("/", Middleware.isLoggedIn, function(req, res){

	var newItem = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		price: Number(req.body.price),
		quantity: Number(req.body.quantity),
		manufacture: req.body.manufacture,
		customer: {
			id: req.user._id,
			username: req.user.username
		}
	};

	//Create the new Item
	Item.create(newItem, function(err, item){
		if(err){
			console.log(err);
		} else {
			res.redirect("items/"+item._id);
		}
	});
});


// route: SHOW - Shows info about single item
router.get("/:id", function(req, res){
	Item.
		findById(req.params.id).
		populate('comments').exec(function(err, item){
		/*{ 
			path: 'comments', 
			populate: { path: 'customer[id]'}
		}).exec(function(err, item){
		*/
		if(err){
			console.log(err);
		} else {
			res.render("items/show", {item: item});
		}
	});
});

// route: EDIT - update item to db
router.get("/:id/edit", Middleware.isLoggedIn, function(req, res){
	Item.findById(req.params.id, function(err, item){
		if(err){
			console.log(err);
		} else {
			res.render("items/edit", {item: item});
		}		
	});
	
});

// route: UPDATE - add new item to db
router.post("/:id/edit", Middleware.isLoggedIn, function(req, res){
	var updateItem = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		price: Number(req.body.price),
		quatity: Number(req.body.quatity),
		manufacture: req.body.manufacture,
		customer: {
			id: req.user._id,
			username: req.user.username
		}
	};

	Item.findByIdAndUpdate(req.params.id, { $set: updateItem }, { new: true }, function(err, item){
		if(err){
			console.log(err);	
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});


// route: DELETE - delete item to db
router.post("/:id/delete", Middleware.isLoggedIn, function(req, res){
	Item.deleteOne({_id: req.params.id}, function(err){
		if(err){
			console.log(err);
		}
		else {
			res.redirect("/")
		}
	});
});


module.exports = router;
