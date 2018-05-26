/// TODO : 
//
//	* Adding new item stores as owner and can only be edited or deleted by owner
//  * Adding new comment can only be deleted by owner or items owner
//  * Users can purchase an item, will add to their order and remove from quantity
//	* Split up routes
//	* Fix storing Remote keys, especially for comments, save id and username
//	* Make the application CRUD compliant
// 	* Middleware
//  * Add flash messages (connect-flash)
//  *
/// TODO END


var express 		= 	require("express"),
	mongoose		= 	require("mongoose"),
	bodyParser		= 	require("body-parser"),
	Customer		=	require("./models/customer"),
	Order			=	require("./models/order"),
	Item  			= 	require("./models/item"),
	Comment			=	require("./models/comment"),
	passport		=	require("passport"),
	LocalStrategy	=	require("passport-local")
	app 			= 	express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//connect to mongoose
mongoose.connect("mongodb://localhost/mystore");

//create a single item
// Item.create({
// 	name: "HP New laptop",
// 	description: "THis is a new laptop from is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
// 	quantity: 1,
// 	manufacture: "HP"
// }, function(err, item){
// 	if (err){
// 		console.log(err);
// 	} else{
// 		console.log(item);
// 	}
// })

/////////////////// PASSPORT CONFIGURATIONS ////////////////////////

// Configure passport
app.use(require("express-session")({
	secret: "This is the Yo Yo Yo!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

//Middleware
app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	next();
})



app.get("/", function(req, res){
	res.redirect("/items");
});

/////////////////// ITEMS ////////////////////////

//route: INDEX - show all items
app.get("/items", function(req, res){
	Item.find({}, function(err, items){
		if (err){
			console.log(err);
		} else {
			res.render("items/index", {items: items});
		}
	});


	
});

//route: NEW - show form to create new item
app.get("/items/new", function(req, res){
	res.render("items/new");
});

// route: CREATE - add new item to db
app.post("/items", isLoggedIn, function(req, res){

	var newItem = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		price: Number(req.body.price),
		quantity: Number(req.body.quantity),
		manufacture: req.body.manufacture
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
app.get("/items/:id", function(req, res){
	Item.
		findById(req.params.id).
		populate({ 
			path: 'comments', 
			populate: { path: 'customer'}
		}).exec(function(err, item){
		if(err){
			console.log(err);
		} else {
			res.render("items/show", {item: item});
		}
	});
});

// route: EDIT - update item to db
app.get("/items/:id/edit", isLoggedIn, function(req, res){
	Item.findById(req.params.id, function(err, item){
		if(err){
			console.log(err);
		} else {
			res.render("items/edit", {item: item});
		}		
	});
	
});

// route: UPDATE - add new item to db
app.post("/items/:id/edit", isLoggedIn, function(req, res){
	var updateItem = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		price: Number(req.body.price),
		quatity: Number(req.body.quatity),
		manufacture: req.body.manufacture
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
app.post("/items/:id/delete", isLoggedIn, function(req, res){
	Item.deleteOne({_id: req.params.id}, function(err){
		if(err){
			console.log(err);
		}
		else {
			res.redirect("/")
		}
	});
});



/////////////////// COMMENTS ////////////////////////

//COMMENT route: NEW - show form to comment
app.post("/items/:id/comment/add", isLoggedIn, function(req, res){
	var customer;
	Customer.findOne({username:req.user.username}, function(err, user){
		if(err){
			console.log(err);
		} else if (user == null){

		}
		else {
			customer = user._id;
			var newComment = {
			title : req.body.title,
			description: req.body.description,
			customer: customer
			}

			Item.findById(req.params.id, function(err, item){
				if(err){
					console.log(err);
				} else {
					Comment.create(newComment, function(err, comment){
						 item.comments.push(comment);
						 item.save();
						 
					});
				}
			});
		}
		res.redirect("/items/" + req.params.id);
	});
});

//COMMENT route: DELETE - delete comment
app.post("/items/:id/comment/:id2/delete", isLoggedIn, function(req, res){
	Comment.deleteOne({_id: req.params.id2}, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});


/////////////////// USERS AUTHENTICATION ////////////////////////

//route: NEW - show form to create new user
app.get("/register", function(req, res){
	res.render("customers/new");
});

app.post("/register", function(req, res){
	var newCustomer = {
		username	: req.body.username,
		fName		: req.body.fname,
		lName		: req.body.lname,
		street		: req.body.street,
		city		: req.body.city,
		state 		: req.body.state,
		zip 		: req.body.zip,
		phone 		: req.body.phone
	};
	Customer.register(newCustomer, req.body.password, function(err, customer){
		if(err){
			console.log(err);
			res.render("customers/new");
		} 
		
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	});
});

//route: PROFILE - show form with profile
app.get("/profile", isLoggedIn, function(req, res){
	Customer.findById(req.user._id, function(err, user){
		if(err){
			console.log(err);
		} else {
			res.render("customers/profile", {user : user});
		}
	});
});

app.post("/profile", isLoggedIn, function(req, res){
	var updateCustomer = {
		username	: req.body.username,
		fName		: req.body.fname,
		lName		: req.body.lname,
		street		: req.body.street,
		city		: req.body.city,
		state 		: req.body.state,
		zip 		: req.body.zip,
		phone 		: req.body.phone
	};
	Customer.findByIdAndUpdate(req.user._id, { $set : updateCustomer }, { new: true }, function(err, customer){
		if(err){
			console.log(err);
			res.redirect("/profile");
		} else {
			res.redirect("/");
		}
			

		
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	});
});

//route: LOGIN - show form to login
app.get("/login", function(req, res){
	res.render("customers/login")
});

// app.post("/login", passport.authenticate("local",
// 	{
// 		successRedirect: "/",
// 		failureRedirect: "/login"
// 	}), function(req, res){
// });

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});


//route: LOGOUT - log user out
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}

// 	res.redirect("/login");
// }

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    //req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


app.listen(3000, function(){
	console.log("server started");
});