/// TODO : 
//
//	* Adding new item stores as owner and can only be edited or deleted by owner 		- DONE
//  * Adding new comment can only be deleted by owner or items owner 					- DONE
//  * Users can purchase an item, will add to their order and remove from quantity		- 
//	* Split up routes																	- DONE
//	* Fix storing Remote keys, especially for comments, save id and username			- DONE
//	* Make the application CRUD compliant												- DONE
// 	* Middleware																		- DONE
//  * Add flash messages (connect-flash)												- DONE
//  * Publish to online
//  * 
/// TODO END


var express 		= 	require("express"),
	mongoose		= 	require("mongoose"),
	bodyParser		= 	require("body-parser"),
	flash 			=	require("connect-flash"),
	Customer		=	require("./models/customer"),
	Order			=	require("./models/order"),
	Item  			= 	require("./models/item"),
	Comment			=	require("./models/comment"),
	methodOverride  = 	require("method-override"),
	passport		=	require("passport"),
	LocalStrategy	=	require("passport-local")
	app 			= 	express();

var itemRoutes		= 	require("./routes/items"),
	authRoutes		=	require("./routes/"),
	commentRoutes	=	require("./routes/comments");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//connect to mongoose
//mongoose.connect("mongodb://localhost/mystore2");
mongoose.connect("mongodb://fsaeed81:sanjose@ds237610.mlab.com:37610/fsaeed81-mystore");

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


app.use(methodOverride("_method"));


/////////////////// PASSPORT CONFIGURATIONS ////////////////////////

// Configure passport
app.use(require("express-session")({
	secret: "This is the Yo Yo Yo!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

//Middleware
app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


app.use('/', authRoutes);
app.use('/items', itemRoutes);
app.use('/items/:id/comment', commentRoutes);


if(process.env.ENVURL){
	app.listen(3000,function(){
		console.log("myStore Has Started!");
	});
} else {
	app.listen(process.env.PORT, process.env.IP, function(){
		console.log("started... ");
	});
}