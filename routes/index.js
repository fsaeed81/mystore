var express 	=	require("express"),
	router		=	express.Router(),
	passport	= 	require("passport"),
	Customer 	=	require("../models/customer"),
	Middleware  = 	require("../middleware");

router.get("/", function(req, res){
	res.redirect("/items");
});


//route: NEW - show form to create new user
router.get("/register", function(req, res){
	res.render("customers/new");
});

router.post("/register", function(req, res){
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
			res.render("customers/new");
		} 
		
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "New user created, welcome " + customer.username);
			res.redirect("/");
		});
	});
});

//route: PROFILE - show form with profile
router.get("/profile", Middleware.isLoggedIn, function(req, res){
	Customer.findById(req.user._id, function(err, user){
		if(err){
			console.log(err);
		} else {
			res.render("customers/profile", {user : user});
		}
	});
});

router.put("/profile", Middleware.isLoggedIn, function(req, res){
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
			req.flash("success", "User account updated.");
			res.redirect("/");
		}		
		
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	});
});

//route: LOGIN - show form to login
router.get("/login", function(req, res){
	res.render("customers/login")
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/items';
      delete req.session.redirectTo;
      req.flash("success", "Logged In, welcome " + user.username);
      res.redirect(redirectTo);
    });
  })(req, res, next);
});


//route: LOGOUT - log user out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "User logged out, goodbye");
	res.redirect("/items");
});


router.delete("/delete", Middleware.isLoggedIn, function(req, res){
	Customer.deleteOne({_id: req.user._id}, function(err){
		if(err){
			req.flash("error", err.message);
			res.redirect("/profile");
		}
		req.flash("success", "User account deleted");
		res.redirect("/");
	});
});


module.exports = router;